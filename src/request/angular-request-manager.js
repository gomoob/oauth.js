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
    // FIXME: Il est peut-être plus logique de configurer le Request Manager avec l'$injector plustôt car il permet de 
    //        récupérer le '$provide'. Regarder aussi le rôle de 'window.angular'...
    this._$provide = configuration.$provide;

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
    // TODO: Renommer cette méthode car elle doit être appelée uniquement après un login et pas pour un rafraichissement 
    //       de token
    _onTokenEndpointPost : function(xhr) {

        // TODO: Les callbacks de login sont appelés dans tous les cas, il est souvent fréquent que l'on ne souhaite pas 
        //       appeler le callback tant que le formulaire de login n'est pas rempli. Il nous faudrait une option pour 
        //       ceci. 
        
        var authStatus = null, 
            loginCb = this._loginContext.getLoginCb(),
            loginFnCb = this._loginContext.getLoginFnCb();

        // Persists the response as an OAuthStatus object
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

    _onRefreshAccessTokenPost : function(xhr, requestContext) {

        // Persists the response as an OAuthStatus object
        var authStatus = this._storageManager.persistAccessTokenResponse(xhr);

        // If the user is considered connected (i.e the OAuth 2.0 Access Token refresh was successful) the replay the 
        // original request
        if(authStatus.isConnected()) {
            
            var replayXhr = new XMLHttpRequest();
            
            replayXhr.open = this._backupedOpen;
            replayXhr.send = this._backupedSend;
            replayXhr.setRequestHeader = this._backupedSetRequestHeader;
            
            // Updates the original XMLHttpRequest URL used to modify the 'access_token' parameter with the new one we 
            // retrieved
            this._requestContext.originalXhr.args.open[1] = OAuth.UrlUtils.addArgument(
                this._requestContext.originalXhr.args.open[1], 
                'access_token',
                authStatus.getAccessTokenResponse().getJsonResponse().access_token
            );
            
            // @see https://github.com/ilinsky/xmlhttprequest/blob/master/XMLHttpRequest.js#L91
            replayXhr.open.apply(replayXhr, this._requestContext.originalXhr.args.open);
            
            // @see https://github.com/ilinsky/xmlhttprequest/blob/master/XMLHttpRequest.js#L330
            replayXhr.setRequestHeader.apply(replayXhr, this._requestContext.originalXhr.args.setRequestHeader);
            
            // @see https://github.com/ilinsky/xmlhttprequest/blob/master/XMLHttpRequest.js#L263
            replayXhr.send.apply(replayXhr, this._requestContext.originalXhr.args.send);
            
            var This = this;
            
            replayXhr.onreadystatechange = function() {

                var xhr = This._requestContext.originalXhr.xhr;

                // @see https://github.com/ilinsky/xmlhttprequest/blob/master/XMLHttpRequest.js#L57
                // If the 'readyState' is DONE then the server returned a response
                if(xhr.readyState === xhr.DONE) {

                    xhr.readyState = this.readyState;
                    xhr.response = this.response;
                    xhr.responseText = this.responseText;
                    xhr.responseType = this.responseType;
                    xhr.responseURL = this.responseURL;
                    xhr.responseXML = this.responseXML;
                    xhr.status = this.status;
                    xhr.statusText = this.statusText;
                    xhr.timeout = this.timeout;
                    xhr.withCredentials = this.withCredentials;
                    
                    if(this.status === 200) {
                        
                        if(xhr.onreadystatechange) { 
                            xhr.onreadystatechange();
                        }
                        
                        if(xhr.onload) {
                            xhr.onload();
                        }
                        
                    } else {
                    
                        console.log('Error after replay...');

                    }

                }
                
            };
            
            console.log('refresh succeeded');

        } 
        
        // TODO
        else {

            console.log('refresh failed');

        }
        
    },
    
    _refreshAccessToken : function(requestContext) {

        // Gets the current authentication status
        var authStatus = this._storageManager.getAuthStatus();

        // Refresh the Access Token, if the refresh is successful then the 'replacedHttpPromise' will be 
        // resolved, otherwise the 'replacedHttpPromise' will be rejected
        var refreshXhr = new XMLHttpRequest();
        refreshXhr.open = this._backupedOpen;
        refreshXhr.send = this._backupedSend;
        refreshXhr.setRequestHeader = this._backupedSetRequestHeader;
        
        // @see https://github.com/ilinsky/xmlhttprequest/blob/master/XMLHttpRequest.js#L91
        refreshXhr.open(
            'POST',                // Method
            this._tokenEndpoint,   // URL
            true                   // Async
        );
        
        // @see https://github.com/ilinsky/xmlhttprequest/blob/master/XMLHttpRequest.js#L330
        refreshXhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
        
        // @see https://github.com/ilinsky/xmlhttprequest/blob/master/XMLHttpRequest.js#L263
        refreshXhr.send(
            OAuth.UrlUtils.toQueryString(
                {
                    grant_type : 'refresh_token',
                    client_id : this._clientId,
                    refresh_token : authStatus.getAccessTokenResponse().getJsonResponse().refresh_token
                }
            )
        );
        
        refreshXhr.onreadystatechange = OAuth.FunctionUtils.bind(
            function(xhr) {

                // @see https://github.com/ilinsky/xmlhttprequest/blob/master/XMLHttpRequest.js#L57
                // If the 'readyState' is DONE then the server returned a response
                if(xhr.readyState === xhr.DONE) {

                    this._onRefreshAccessTokenPost(xhr, requestContext);

                }
                
            }, 
            this, 
            refreshXhr
        );

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
                
                // Create a wrapper which will proxy all its call to the original Angular JS '$http' service 
                // configured in the request manager
                var wrapper = function() {
                
                    return This._$http.apply(This._$http, arguments);
 
                };

                // Overwrite the Angular JS '$http.get(url, config)' method
                wrapper.get = OAuth.FunctionUtils.bind(
                    function() {
                        
                        // Update the arguments to add or update the 'access_token' URL argument if the 'secured' 
                        // parameter is true
                        var updatedArguments = this._updateAngularHttpMethodArguments('get', arguments);
                        
                        // Calls the Angular JS `$http.get` method with the updated arguments, when the `http.get` 
                        // method will call an XMLHttpRequest it will call the methods overwritten by OAuth.JS to 
                        // manage OAuth 2.0 Access Token refresh if necessary.
                        return this._$http.get.apply(this._$http, updatedArguments);

                    }, 
                    This
                );
                
                // Overwrite the Angular JS '$http.head(url, config)' method
                wrapper.head = OAuth.FunctionUtils.bind(
                    function() {
                        
                        // Update the arguments to add or update the 'access_token' URL argument if the 'secured' 
                        // parameter is true
                        var updatedArguments = this._updateAngularHttpMethodArguments('head', arguments);
                        
                        // Calls the Angular JS `$http.head` method with the updated arguments, when the `http.head` 
                        // method will call an XMLHttpRequest it will call the methods overwritten by OAuth.JS to 
                        // manage OAuth 2.0 Access Token refresh if necessary.
                        return this._$http.head.apply(this._$http, updatedArguments);

                    }, 
                    This
                );
                
                // Overwrite the Angular JS '$http.post(url, config)' method
                wrapper.post = OAuth.FunctionUtils.bind(
                    function() {
                        
                        // Update the arguments to add or update the 'access_token' URL argument if the 'secured' 
                        // parameter is true
                        var updatedArguments = this._updateAngularHttpMethodArguments('post', arguments);
                        
                        // Calls the Angular JS `$http.post` method with the updated arguments, when the `http.post` 
                        // method will call an XMLHttpRequest it will call the methods overwritten by OAuth.JS to 
                        // manage OAuth 2.0 Access Token refresh if necessary.
                        return this._$http.post.apply(this._$http, updatedArguments);

                    }, 
                    This
                );
                
                // Overwrite the Angular JS '$http.put(url, config)' method
                wrapper.put = OAuth.FunctionUtils.bind(
                    function() {
                        
                        // Update the arguments to add or update the 'access_token' URL argument if the 'secured' 
                        // parameter is true
                        var updatedArguments = this._updateAngularHttpMethodArguments('put', arguments);
                        
                        // Calls the Angular JS `$http.put` method with the updated arguments, when the `http.put` 
                        // method will call an XMLHttpRequest it will call the methods overwritten by OAuth.JS to 
                        // manage OAuth 2.0 Access Token refresh if necessary.
                        return this._$http.put.apply(this._$http, updatedArguments);

                    }, 
                    This
                );
                
                // Overwrite the Angular JS '$http.delete(url, config)' method
                wrapper.delete = OAuth.FunctionUtils.bind(
                    function() {
                        
                        // Update the arguments to add or update the 'access_token' URL argument if the 'secured' 
                        // parameter is true
                        var updatedArguments = this._updateAngularHttpMethodArguments('delete', arguments);
                        
                        // Calls the Angular JS `$http.delete` method with the updated arguments, when the 
                        // `http.delete` method will call an XMLHttpRequest it will call the methods overwritten by 
                        // OAuth.JS to manage OAuth 2.0 Access Token refresh if necessary.
                        return this._$http.delete.apply(this._$http, updatedArguments);

                    }, 
                    This
                );
                
                // Overwrite the Angular JS '$http.jsonp(url, config)' method
                wrapper.jsonp = OAuth.FunctionUtils.bind(
                    function() {
                        
                        // Update the arguments to add or update the 'access_token' URL argument if the 'secured' 
                        // parameter is true
                        var updatedArguments = this._updateAngularHttpMethodArguments('jsonp', arguments);
                        
                        // Calls the Angular JS `$http.jsonp` method with the updated arguments, when the 
                        // `http.jsonp` method will call an XMLHttpRequest it will call the methods overwritten by 
                        // OAuth.JS to manage OAuth 2.0 Access Token refresh if necessary.
                        return this._$http.jsonp.apply(this._$http, updatedArguments);

                    }, 
                    This
                );
                
                // Overwrite the Angular JS '$http.patch(url, config)' method
                wrapper.patch = OAuth.FunctionUtils.bind(
                    function() {
                        
                        // Update the arguments to add or update the 'access_token' URL argument if the 'secured' 
                        // parameter is true
                        var updatedArguments = this._updateAngularHttpMethodArguments('patch', arguments);
                        
                        // Calls the Angular JS `$http.patch` method with the updated arguments, when the 
                        // `http.patch` method will call an XMLHttpRequest it will call the methods overwritten by 
                        // OAuth.JS to manage OAuth 2.0 Access Token refresh if necessary.
                        return this._$http.patch.apply(this._$http, updatedArguments);

                    }, 
                    This
                );

                return wrapper;
                
            }
        );

        // Backup the original XHMLHttpRequest 'open' method to reuse it
        this._backupedOpen = XMLHttpRequest.prototype.open;
        this._backupedSend = XMLHttpRequest.prototype.send;
        this._backupedSetRequestHeader = XMLHttpRequest.prototype.setRequestHeader;

        // Change the reference to the HTMLHttpRequest 'open' method to use the OAuth.JS custom 'open' method 
        // instead            
        XMLHttpRequest.prototype.open = function() {
            
            // Remove the 'callee', 'caller', 'set_callee', 'get_collee', 'set_caller' and 'get_caller' methods
            // This is because the special 'arguments' Javascript object is not an array
            // @see https://developer.mozilla.org/docs/Web/JavaScript/Reference/Fonctions/arguments
            var slicedArguments = [].slice.call(arguments);
            
            This._requestContext =  new OAuth.RequestContext();
            This._requestContext.originalXhr.xhr = this;
            This._requestContext.originalXhr.args.open = slicedArguments;

            // Calls the OAuth.JS 'open' method
            return This._open(this, slicedArguments);
            
        };
        
        XMLHttpRequest.prototype.setRequestHeader = function(key, value) {
            
            // Remove the 'callee', 'caller', 'set_callee', 'get_collee', 'set_caller' and 'get_caller' methods
            // This is because the special 'arguments' Javascript object is not an array
            // @see https://developer.mozilla.org/docs/Web/JavaScript/Reference/Fonctions/arguments
            var slicedArguments = [].slice.call(arguments);
            
            This._requestContext.originalXhr.args.setRequestHeader = slicedArguments;
            
            // Calls the OAuth.JS 'setRequestHeader' method
            return This._setRequestHeader(this, slicedArguments);
            
        };
        
        XMLHttpRequest.prototype.send = function(key, value) {
            
            // Remove the 'callee', 'caller', 'set_callee', 'get_collee', 'set_caller' and 'get_caller' methods
            // This is because the special 'arguments' Javascript object is not an array
            // @see https://developer.mozilla.org/docs/Web/JavaScript/Reference/Fonctions/arguments
            var slicedArguments = [].slice.call(arguments);
            
            This._requestContext.originalXhr.args.send = slicedArguments;
            
            // Calls the OAuth.JS 'setRequestHeader' method
            return This._send(this, slicedArguments);
            
        };
        
    },
    
    _setRequestHeader : function(xhr, slicedArguments) {
        
        this._backupedSetRequestHeader.apply(this._realXhr, slicedArguments);

    },
    
    _send : function(xhr, slicedArguments) {
        
        this._backupedSend.apply(this._realXhr, slicedArguments);
        
    },
    
    // TODO: Méthode open permettant l'exécution de la requête avec 'access_token'
    _open : function(xhr, slicedArguments) {

        // We ensure that if the provided arguments are modified somewhere in the code this has no impact on the 
        // standard XMLHttpRequest behavior. So we clone the original HTMLHttpRequest arguments before working with 
        // them.
        var clonedOpenArguments = this._cloneOpenArguments(slicedArguments);
        
        // Augment the original XMLHttpRequest arguments by adding arguments specific to OAuth 2.0 / OAuth.JS
        var augmentedOpenArguments = this._augmentOpenArguments(clonedOpenArguments);
        
        // We create an other XMLHttpRequest object to execute the request
        // TODO: C'est ce qui permettra d'intercepter la réponse OK ou KO...
        this._realXhr = new XMLHttpRequest();
        this._realXhr.open = this._backupedOpen;
        this._realXhr.send = this._backupedSend;
        this._realXhr.setRequestHeader = this._backupedSetRequestHeader;
        
        this._backupedOpen.apply(this._realXhr, slicedArguments);
        
        var This = this;
        this._realXhr.onreadystatechange = function() {
            
            // @see https://github.com/ilinsky/xmlhttprequest/blob/master/XMLHttpRequest.js#L57
            switch(this.readyState) {
                case 1:
                    console.log('OPENED');
                break;
                case 4:
                    
                    xhr.readyState = this.readyState;
                    xhr.response = this.response;
                    xhr.responseText = this.responseText;
                    xhr.responseType = this.responseType;
                    xhr.responseURL = this.responseURL;
                    xhr.responseXML = this.responseXML;
                    xhr.status = this.status;
                    xhr.statusText = this.statusText;
                    xhr.timeout = this.timeout;
                    xhr.withCredentials = this.withCredentials;
                    
                    if(this.status === 200) {
                        
                        if(xhr.onreadystatechange) { 
                            xhr.onreadystatechange();
                        }
                        
                        if(xhr.onload) {
                            xhr.onload();
                        }
                        
                    } else {
                    
                        var action = This._parseErrorFn(xhr);
                        
                        if(action === 'refresh') {
                            
                            This._refreshAccessToken();

                        } else {

                            // Reniew in all other cases...
                            console.log('reniew');

                        }
                        

                    }

                break;
            
            }
            
        };

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
     * Utility function used to update an array of arguments passed to an Angular JS `$http` method. Those arguments 
     * could have been passed to the `get`, `head`, `post`, `put`, `delete`, `jsonp` or `patch` method. The purpose of 
     * this method is to automatically update the URL provided with the arguments to append the OAuth 2.0 'access_token'
     * URL parameter. The 'access_token' URL parameter is only appended to the URL is the 'secured' configuration 
     * parameter is found.
     * 
     * @param {String} method The name of the method for which one to update arguments, this can be equal to `get`, 
     *        `head`, `post`, `put`, `delete`, `jsonp` or `patch`.
     * @param {Array} args An array of arguments passed to an Angular JS `$http` method, for exemple if 
     *        `$http.get('http://www.website.com/rest', { secured : true })` is called then the array will be 
     *        `['http://www.website.com/rest', { secured : true }]`.
     *        
     * @return {Array} The updated arguments array, only the first argument (i.e the URL) could have been updated, this 
     *         update is only applied if the second argument provides the 'secured' parameter with a true value.
     */
    // TODO: A tester
    _updateAngularHttpMethodArguments : function(method, args) {

        // TODO: Ici il est plus sage de faire un clone...
        var updatedArguments = args, 
            configIndex = null;

        switch(method) {
        
            // Methods which accepts (url, [config]) arguments
            case 'get':
            case 'head':
            case 'delete':
            case 'jsonp':
                // If the optionnal 'config' argument is provided
                if(args.length > 1) {
                    configIndex = 1;
                }
                break;
            case 'patch':
            case 'post':
            case 'put':
                // If the optionnal 'config' argument is provided
                if(args.length > 2) {
                    configIndex = 2;
                }
                break;
            default:
                throw new Error('Invalid method value \'' + method + '\' !');
        }

        // If the AngularJS $http.get(url, config) is called with a 'config' parameter and this 'config' 
        // parameter indicates the request has to be secured
        if(configIndex && updatedArguments[configIndex].secured === true) {

            // Gets the current AuthStatus
            var authStatus = this._storageManager.getAuthStatus();
            
            // Updates the URL to append the 'access_token' parameter
            updatedArguments[0] = OAuth.UrlUtils.addArgument(
                updatedArguments[0],
                'access_token',
                authStatus.getAccessTokenResponse().getJsonResponse().access_token
            );

        }

        return updatedArguments;

    }

};
