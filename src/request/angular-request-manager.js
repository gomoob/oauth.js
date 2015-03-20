/**
 * 
 * 
 * @author Baptiste GAILLARD (baptiste.gaillard@gomoob.com)
 */
OAuth.Request.AngularRequestManager = function(configuration) {
    
    // The AngularRequestManager extends the AbstractRequestManager
    OAuth.Request.AbstractRequestManager.apply(this, arguments);
    
    /**
     * A reference to the original AngularJS `$http` service, this reference is backuped before OAuth.JS creates a 
     * decorator around this `$http` service to modify its default behavior.
     * 
     * @instance
     * @private
     * @type {service.$http}
     * @see https://docs.angularjs.org/api/ng/service/$http
     */
    this._$http = null;
    
    /**
     * A reference to the AngularJS `$provide` service, this is used by OAuth.JS to create a decorator around the 
     * `$http` service to overwrite default request behavior.
     * 
     * @instance
     * @private
     * @type {auto.$provide}
     * @see https://docs.angularjs.org/api/auto/service/$provide
     */
    this._$provide = configuration.$provide;

    /**
     * The function used to retrieve credentials to get an OAuth 2.0 Access Token.
     */
    this._loginFn = null;

    // If a specific configuration is provided
    if(OAuth.ObjectUtils.isObject(configuration)) {

        // The login function is required
        if(typeof configuration.loginFn !== 'function') {
            
            throw new Error('No login function is provided !');
            
        }
        
        this._loginFn = configuration.loginFn;

        // The client id is required
        if(typeof configuration.clientId === 'undefined') {

            throw new Error('No client id is provided !');

        }

        this._clientId = configuration.clientId;

        // The token endpoint is required
        if(typeof configuration.tokenEndpoint !== 'string') {
            
            throw new Error('No token endpoint is provided or its valued is invalid !');
            
        }
        
        this._tokenEndpoint = configuration.tokenEndpoint;

        // The parse error function is required
        if(typeof configuration.parseErrorFn !== 'function') {

            throw new Error('No parse error function is provided !');

        } 
        
        this._parseErrorFn = configuration.parseErrorFn;

        // Instanciate the OAuth 2.0 Access Token response storage
        this._storageManager = new OAuth.StorageManager({
            storage : configuration.storage,
            storageKey : configuration.storageKey
        });
        
    }
    
    // Otherwise the request manager uses a default configuration
    else {
        
        throw new Error('A configuration object is required !');

    }
    
};
OAuth.Request.AngularRequestManager.prototype = {

    //TODO: Ceci correspond presque à la méthode '_login' que l'on a en Backbone
    sendCredentials : function(credentials, cb, opts) {
        
        this._loginContext = new OAuth.LoginContext();
        this._loginContext._setLoginCb(cb);
        this._loginContext._setLoginOpts(opts);
        this._loginContext._setRequestManager(this);
        
        var xhr = new XMLHttpRequest();
    
        switch(credentials.grant_type) {
            case 'password':
                
                // @see https://github.com/ilinsky/xmlhttprequest/blob/master/XMLHttpRequest.js#L91
                xhr.open(
                    'POST',                // Method
                    this._tokenEndpoint,   // URL
                    true                   // Async
                );
                
                // @see https://github.com/ilinsky/xmlhttprequest/blob/master/XMLHttpRequest.js#L330
                xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
                
                // @see https://github.com/ilinsky/xmlhttprequest/blob/master/XMLHttpRequest.js#L263
                xhr.send(
                    OAuth.UrlUtils.toQueryString(
                        {
                            grant_type : credentials.grant_type,
                            client_id : this._clientId,
                            username : credentials.username,
                            password : credentials.password
                        }
                    )
                );

                xhr.onreadystatechange = 
                    OAuth.FunctionUtils.bind(this._onreadystatechangeTokenEndpointPost, this, xhr);
                
                break;
            default:
                throw new Error('Invalid credentials \'grant_type\' provided !');
        }
        
    },
    
    /**
     * Callback function called when an HTTP POST request is sent to the configured OAuth 2.0 Token Endpoint. This 
     * function is called if the POST is successful or in error, then an Access Token Response Parser (see 
     * {@link OAuth.AccessToken.ResponseParser) is used to know if the response is successful or not. 
     * 
     * @param {XMLHttpRequest} xhr The XMLHttpRequest object used to send an HTTP POST request to the OAuth 2.0 Token 
     *        Endpoint.
     */
    _onTokenEndpointPost : function(xhr) {

        // TODO: Les callbacks de login sont appelés dans tous les cas, il est souvent fréquent que l'on ne souhaite pas 
        //       appeler le callback tant que le formulaire de login n'est pas rempli. Il nous faudrait une option pour 
        //       ceci. 
        
        var authStatus = null, 
            loginCb = this._loginContext.getLoginCb(),
            loginFnCb = this._loginContext.getLoginFnCb();

        // Persists the response as a OAuthStatus object
        authStatus = this._storageManager.persistAccessTokenResponse(xhr);
                
        // If the 'loginFn' or 'sendCredentials' function has provided a 'loginFnCb' callback we call it first, then 
        // when its called we call the login callback.  
        if(typeof loginFnCb === 'function') {
            
            var promise = new OAuth.Promise(
                function(resolve, reject) {
                    
                    // Calls the 'loginFnCb' callback with the 'resolve' and 'reject' to allow the developer to fullfill 
                    // the promise or reject it.
                    //  - If the promise is fullfilled this indicates that the login form has been successfully filled
                    //  - If the promise is rejected this indicates that the login form has not been successfully filled
                    loginFnCb(authStatus, resolve, reject);

                }
            );
            promise.then(
                function(value) {
                    
                    // The form has been successfully filled
                    loginCb(authStatus);

                }, 
                function(reason) {
                    
                    // The form has not been successfully filled
                    loginCb(authStatus);

                }
            );

        } 
        
        // Otherwise we call the 'login' function callback directly
        else {

            loginCb(authStatus);

        }
        
    },
    
    _onreadystatechangeTokenEndpointPost : function(xhr, slicedArguments) {
        
        // @see https://github.com/ilinsky/xmlhttprequest/blob/master/XMLHttpRequest.js#L57
        // If the 'readyState' is DONE then the server returned a response
        if(xhr.readyState === xhr.DONE) {
            
            this._onTokenEndpointPost(xhr);
            
        }

    },
                                        
    /**
     * Function used to login a user, by default this function checks if the user is already logged in, if it is the 
     * configured 'loginFn' function is not called and the provided 'loginCb' callback is directly called. Otherwise the 
     * 'loginFn' callback function is called before calling the provided callback. 
     * 
     * @param loginCb A callback function to be called when a login action has been done.
     * @param opts Options used to configure the login.
     */
    login : function(loginCb, opts) {
    
        // Creates and configures a Login Conext which is then received by the configured 'loginFn' method and is also 
        // used in the Request Manager
        this._loginContext = new OAuth.LoginContext();
        this._loginContext._setLoginCb(loginCb);
        this._loginContext._setLoginOpts(opts);
        this._loginContext._setRequestManager(this);
        
        // If the client is considered disconnected
        if(this._storageManager.getAuthStatus().isDisconnected()) {
    
            // Calls the configured 'loginFn' method, this one will resolve the credentials promise by providing 
            // credentials
            this._loginFn(this._loginContext);
    
            // FIXME: Ici il serait beaucoup plus propre que la credentials promise lève un événement une fois la fin de 
            //        l'exécution de 'sendCredentials' et que le Request Manager écoute cet événement. Ainsi la 
            //        Credentials Promise n'aurait pas à dépendre du Request Manager
    
        }
        
        // Otherwise if the user is considered connected we call the callback directly
        // Please note that even if the client is considered connected the 'loginCb' callback can execute secured 
        // OAuth 2.0 HTTP requests which will change the current AuthStatus state to a 'disconnected' status if an error 
        // is encountered
        else {

            loginCb(this._storageManager.getAuthStatus());

        }
        
    },
                  
    _$httpGet : function() {
        
        // arguments[0] : L'URL
        // arguments[1] : L'objet 'config' passées en second arguments à la méthode get() d'AngularJS, c'est dans cet 
        //                objet que l'on peut éventuellement avoir l'option 'secured'
        
        var augmentedArguments = arguments;
        
        // TODO: Uniquement si arguments[1] est défini et arguments[1].secured est vrai...
        if(!augmentedArguments[1].params) {
            augmentedArguments[1].params = {};
        }
        
        // Gets the user authentication status
        var authStatus = this._storageManager.getAuthStatus();
        
        // Appends the 'access_token' URL parameter
        // TODO: Vérifier que le token ne soit pas déjà dans l'URL...
        if(authStatus.isConnected()) {

            augmentedArguments[1].params.access_token = authStatus.getAccessTokenResponse().getJsonResponse().access_token;
            
        }

        var _resolve = null,
            _reject = null;

        var httpPromise = this._$http.get.apply(this._$http, augmentedArguments), 
            replacedHttpPromise = $q(
                function(resolve) {
                    _resolve(resolve);
                },
                function(reject) {
                    _reject(reject);
                }
            );
        
        // TODO: 1.Créer une promise OAuth (doit être exactement pareil qu'une HttpPromise AngularJS)
        //       2.Intercepter la promise HTTP AngularJS
        //          a. Si succès alors résolution de la promise OAuth avec le retour de la promise AngularJS
        //          b. Si erreur alors 
        //            i.  si le retour serveur indique qu'un rafraichissement est possible tentative de rafraichissement 
        //                automatique 
        //            ii. si le retour serveur undique qu'un rafraichissement n'est pas possible déconnection (avec 
        //                code d'erreur clair) et redirection vers la fenêtre de connexion

        httpPromise.then(
            function(response) {

                // See the code of 'src/ng/http.js' => then search for 'promise.success'
                // @see https://github.com/angular/angular.js/blob/master/src/ng/http.js#L814
                
                // a. Si succès alors résolution de la promise OAuth avec le retour de la promise Angular JS
                _resolve(response);
                
            },
            function(response) {
                
                // See the code of 'src/ng/http.js' => then search for 'promise.success'
                // @see https://github.com/angular/angular.js/blob/master/src/ng/http.js#L823
                
                // b. Si erreur alors 
                //    i.  si le retour serveur indique qu'un rafraichissement est possible tentative de rafraichissement 
                //        automatique 
                //    ii. si le retour serveur undique qu'un rafraichissement n'est pas possible déconnection (avec 
                //        code d'erreur clair) et redirection vers la fenêtre de connexion
                
            }
        );
        
        return replacedHttpPromise;
        //return httpPromise;
        
    },
    
    /**
     * Start the AngularJS Request Manager, the purpose of the start method is to overwrites the Angular JS HTTP service 
     * to manage OAuth 2.0 Access Token operations transparently.
     */
    start : function() {
        
        var This = this;
        
        this._$provide.decorator(
            '$http', 
            function($delegate) {
            
                This._$http = $delegate;
                
                // Create a wrapper which will proxy all its call to the original Angular JS '$http' service configured 
                // in the request manager
                var wrapper = function() {
                
                    return This._$http.apply(This._$http, arguments);

                };

                // The '$http' wrapper defines new requests methods to automatically add the required OAuth 2.0 
                // parameter when the developer provides the special 'secured' parameter with a true value
                wrapper.get = OAuth.FunctionUtils.bind(This._$httpGet, This);
                // wrapper.head = OAuth.FunctionUtils.bind(This._$httpHead, This);
                // wrapper.post = OAuth.FunctionUtils.bind(This._$httpPost, This);
                // wrapper.put = OAuth.FunctionUtils.bind(This._$httpPu, This);
                // wrapper.delete = OAuth.FunctionUtils.bind(This._$httpDelete, This);
                // wrapper.jsonp = OAuth.FunctionUtils.bind(This._$httpJsonp, This);
                // wrapper.patch = OAuth.FunctionUtils.bind(This._$httpPatch, This);

                // TODO: Faire une surcharge complète...
                
                return wrapper;
                
            }
        );
        
/*        
        // Backup the original XHMLHttpRequest 'open' method to reuse it
        this._backupedOpen = XMLHttpRequest.prototype.open;
    
        // Change the reference to the HTMLHttpRequest 'open' method to use the OAuth.JS custom 'open' method 
        // instead            
        XMLHttpRequest.prototype.open = function() {
            
            // Remove the 'callee', 'caller', 'set_callee', 'get_collee', 'set_caller' and 'get_caller' methods
            // This is because the special 'arguments' Javascript object is not an array
            // @see https://developer.mozilla.org/docs/Web/JavaScript/Reference/Fonctions/arguments
            var slicedArguments = [].slice.call(arguments);
            
            // Calls the OAuth.JS 'open' method
            return This._open(this, slicedArguments);
            
        };
*/

    },
    
    _open : function(xhr, slicedArguments) {
        
        // We ensure that if the provided arguments are modified somewhere in the code this has no impact on the 
        // standard XMLHttpRequest behavior. So we clone the original HTMLHttpRequest arguments before working with 
        // them.
        var clonedOpenArguments = this._cloneOpenArguments(slicedArguments);
        
        // Augment the original XMLHttpRequest arguments by adding arguments specific to OAuth 2.0 / OAuth.JS
        var augmentedOpenArguments = this._augmentOpenArguments(clonedOpenArguments);
        
        xhr.onreadystatechange = function() {
            
            // @see https://github.com/ilinsky/xmlhttprequest/blob/master/XMLHttpRequest.js#L57
            switch(this.readyState) {
                // UNSENT
                case 0:
                    console.log('UNSENT');
                    break;
                // OPENED
                case 1:
                    console.log('OPENED');
                    break;
                // HEADERS_RECEIVED
                case 2:
                    console.log('HEADERS_RECEIVED');
                    break;
                // LOADING
                case 3:
                    console.log('LOADING');
                    break;
                // DONE
                case 4:
                    console.log('DONE');
                    break;
            }
            
        };
    
        console.log('Tada !');
        console.log(arguments);
        console.log([].slice.call(arguments));
        
        return this._backupedOpen.apply(xhr, slicedArguments);
        
    },
    
    _cloneOpenArguments : function(slicedArguments) {
        
        // TODO: Méthode à implémenter
        return slicedArguments;
        
    },
    
    _augmentOpenArguments : function(openArguments) {
        
        // Try to get an OAuth 2.0 Access Token from the client storage
        var accessToken = this._storageManager.getAccessToken();
        
        // Appends the 'access_token' URL parameter
        if(accessToken) {
    
            // TODO: A implémenter...
            
        }
    
    },
    
    /**
     * Function called after a 'loginFn' function is called and the 'LoginContext.sendCredentials' is called. 
     * 
     * @param loginCb A callback function to be called when a login action has been done, please note that this callback 
     *        is the one passed to 'OAuth.login(loginCb)' and is note the one passed to the 'loginFn'. 
     */
    _login : function(loginContext) {
    
        // FIXME: Normalement ici les 2 objet sont toujours égaux !!!
        this._loginContext = loginContext;
        
        var ajaxPromise = null, 
            credentials = this._loginContext.getCredentials();
    
        console.log(credentials);
        
    /*            
        if(credentials.grant_type === 'password') {
        
            ajaxPromise = $.ajax(
                {
                    contentType : 'application/x-www-form-urlencoded; charset=UTF-8',
                    data : {
                        grant_type : credentials.grant_type,
                        client_id : this._clientId,
                        username : credentials.username,
                        password : credentials.password
                    },
                    type : 'POST',
                    url: this._tokenEndpoint        
                }
            );
            
        } else if(credentials.grant_type === 'gomoob_facebook_access_token') {
            
            ajaxPromise = $.ajax(
                {
                    contentType : 'application/x-www-form-urlencoded; charset=UTF-8',
                    data : {
                        grant_type : credentials.grant_type,
                        client_id : this._clientId,
                        facebook_access_token : credentials.facebook_access_token,
                        facebook_app_scoped_user_id : credentials.facebook_app_scoped_user_id
                    },
                    type : 'POST',
                    url: this._tokenEndpoint        
                }
            );
            
        } else {
            
            throw new Error('Unknown \'grant_type\' = \'' + credentials.grant_type + '\' !');
            
        }
        
        // TODO: Message d'erreur clair si 'grant_type' non supporté...
    
        ajaxPromise.done($.proxy(this._onTokenEndpointPost, this));
        ajaxPromise.fail($.proxy(this._onTokenEndpointPost, this));
    */
    },

};
