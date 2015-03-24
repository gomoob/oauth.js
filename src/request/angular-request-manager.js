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

    /**
     * Function used to send credentials use the configured OAuth 2.0 Token Endpoint.
     * 
     * @param {Object} credentials TODO A DOCUMENTER
     * @param {Function} cb TODO A DOCUMENTER
     * @param {Object} opts TODO A DOCUMENTER
     */
    // TODO: A tester et documenter...
    sendCredentials : function(credentials, cb, opts) {

        this._loginContext = new OAuth.LoginContext();
        this._loginContext._setLoginCb(cb);
        this._loginContext._setLoginOpts(opts);
        this._loginContext._setRequestManager(this);

        var xhr = new XMLHttpRequest();
        xhr.requestType = '__oauth_js_send_credentials__';

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
                
                // Firefox bug
                // @see https://bugzilla.mozilla.org/show_bug.cgi?id=416178
                // @see http://www.w3.org/TR/html5/forms.html#application/x-www-form-urlencoded-encoding-algorithm
                // @see https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequest#sendAsBinary()_polyfill
                if(navigator.userAgent.toLowerCase().indexOf('firefox') > -1)
                {
                    var sData = OAuth.UrlUtils.toQueryString(
                        {
                            grant_type : credentials.grant_type,
                            client_id : this._clientId,
                            username : credentials.username,
                            password : credentials.password
                        }
                    );                  
                    
                    var nBytes = sData.length, 
                        ui8Data = new Uint8Array(nBytes);
                    
                    for (var nIdx = 0; nIdx < nBytes; nIdx++) {
                        ui8Data[nIdx] = sData.charCodeAt(nIdx) & 0xff;
                    }
                                    
                    xhr.send(ui8Data);
                    
                } 
                
                // All other browsers
                else {
                
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
                    
                }

                var This = this;

                xhr.onreadystatechange = function() {

                    // @see https://github.com/ilinsky/xmlhttprequest/blob/master/XMLHttpRequest.js#L57
                    // If the 'readyState' is DONE then the server returned a response
                    if(xhr.readyState === XMLHttpRequest.DONE) {
                        
                        This._onTokenEndpointPost(xhr);

                    }

                };
                
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
            
            this._replayXhr = new XMLHttpRequest();
            
            this._replayXhr.open = this._backupedOpen;
            this._replayXhr.send = this._backupedSend;
            this._replayXhr.setRequestHeader = this._backupedSetRequestHeader;
            
            // Updates the original XMLHttpRequest URL used to modify the 'access_token' parameter with the new one we 
            // retrieved
            requestContext.originalXhr.args.open[1] = OAuth.UrlUtils.addArgument(
                requestContext.originalXhr.args.open[1], 
                'access_token',
                authStatus.getAccessTokenResponse().getJsonResponse().access_token
            );
            
            // @see https://github.com/ilinsky/xmlhttprequest/blob/master/XMLHttpRequest.js#L91
            this._replayXhr.open.apply(this._replayXhr, requestContext.originalXhr.args.open);
            
            // @see https://github.com/ilinsky/xmlhttprequest/blob/master/XMLHttpRequest.js#L330
            this._replayXhr.setRequestHeader.apply(this._replayXhr, requestContext.originalXhr.args.setRequestHeader);
            
            // @see https://github.com/ilinsky/xmlhttprequest/blob/master/XMLHttpRequest.js#L263
            this._replayXhr.send.apply(this._replayXhr, requestContext.originalXhr.args.send);
            
            var This = this;
            
            this._replayXhr.onreadystatechange = function() {

                var originalXhr = requestContext.originalXhr.xhr;

                // @see https://github.com/ilinsky/xmlhttprequest/blob/master/XMLHttpRequest.js#L57
                // If the 'readyState' is DONE then the server returned a response
                if(This._replayXhr.readyState === XMLHttpRequest.DONE) {

                    // Copy all the XMLHttpRequest attribute of the "replay xhr" to the "original xhr" to propagate its 
                    // state 
                    OAuth.XhrUtils.copyAttributes(This._replayXhr, originalXhr);
                    
                    // The server returned a 2xx HTTP Response
                    if(This._replayXhr.status >= 200 && This.__replayXhr < 300) {

                        if(originalXhr.onreadystatechange) { 
                            originalXhr.onreadystatechange();
                        }

                        if(originalXhr.onload) {
                            originalXhr.onload();
                        }
                        
                    } 
                    
                    // The server returned an other HTTP Response
                    else {
                    
                        console.log('Error after replay...');

                    }

                }
                
            };

        } 
        
        // Otherwise if the AuthStatus is disconnected it means that the refresh token request returned an error, in 
        // this case we redirect the user to the login form 
        else {

            // Calls the configured 'loginFn' method, this one will resolve the credentials promise by providing 
            // credentials
            this._loginFn(this._loginContext);

        }
        
    },
    
    _refreshAccessToken : function(requestContext) {

        var This = this;
        
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
        
        refreshXhr.onreadystatechange = function() {

            // @see https://github.com/ilinsky/xmlhttprequest/blob/master/XMLHttpRequest.js#L57
            // If the 'readyState' is DONE then the server returned a response
            if(refreshXhr.readyState === XMLHttpRequest.DONE) {

                This._onRefreshAccessTokenPost(refreshXhr, requestContext);

            }
            
        };

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
                var $httpWrapper = function() {
                
                    // Update the arguments to add or update the 'access_token' URL argument if the 'secured' 
                    // parameter is true
                    var updatedArguments = arguments; 
                    updatedArguments[0] = This._updateAngularHttpConfig(updatedArguments[0]);
                    
                    // Calls the Angular JS `$http` method with the updated arguments, when the `http` method will call 
                    // an XMLHttpRequest it will call the methods overwritten by OAuth.JS to manage OAuth 2.0 Access 
                    // Token refresh if necessary.
                    return This._$http.apply(This._$http, updatedArguments);
 
                };

                // Overwrite the Angular JS '$http.get(url, [config])' method
                $httpWrapper.get = function() {
                        
                    // Transform the parameters to parameters compliant with '$http(config)'
                    // TODO: Créer une méthode '_transformHttpShortcutMethodArguments(arguments)'
                    var updatedArguments = arguments[1]; 
                    updatedArguments.method = 'GET';
                    updatedArguments.url = arguments[0];

                    // Delegate the call to '$http(config)'
                    return new $httpWrapper(updatedArguments);

                };

                // Overwrite the Angular JS '$http.head(url, [config])' method
                $httpWrapper.head = function() {
                        
                    // Transform the parameters to parameters compliant with '$http(config)'
                    // TODO: Créer une méthode '_transformHttpShortcutMethodArguments(arguments)'
                    var updatedArguments = arguments[1]; 
                    updatedArguments.method = 'HEAD';
                    updatedArguments.url = arguments[0];

                    // Delegate the call to '$http(config)'
                    return new $httpWrapper(updatedArguments);

                };
                
                // Overwrite the Angular JS '$http.post(url, data, [config])' method
                $httpWrapper.post = function() {
                        
                    // Transform the parameters to parameters compliant with '$http(config)'
                    // TODO: Créer une méthode '_transformHttpShortcutMethodArguments(arguments)'
                    var updatedArguments = arguments[2];
                    updatedArguments.data = arguments[1];
                    updatedArguments.method = 'POST';
                    updatedArguments.url = arguments[0];

                    // Delegate the call to '$http(config)'
                    return new $httpWrapper(updatedArguments);

                };
                
                // Overwrite the Angular JS '$http.put(url, data, [config])' method
                $httpWrapper.put = function() {
                        
                    // Transform the parameters to parameters compliant with '$http(config)'
                    // TODO: Créer une méthode '_transformHttpShortcutMethodArguments(arguments)'
                    var updatedArguments = arguments[2];
                    updatedArguments.data = arguments[1];
                    updatedArguments.method = 'POST';
                    updatedArguments.url = arguments[0];

                    // Delegate the call to '$http(config)'
                    return new $httpWrapper(updatedArguments);

                };
                
                // Overwrite the Angular JS '$http.delete(url, [config])' method
                $httpWrapper.delete = function() {
                        
                    // Transform the parameters to parameters compliant with '$http(config)'
                    // TODO: Créer une méthode '_transformHttpShortcutMethodArguments(arguments)'
                    var updatedArguments = arguments[1]; 
                    updatedArguments.method = 'HEAD';
                    updatedArguments.url = arguments[0];

                    // Delegate the call to '$http(config)'
                    return new $httpWrapper(updatedArguments);

                };
                
                // Overwrite the Angular JS '$http.jsonp(url, [config])' method
                $httpWrapper.jsonp = function() {
                        
                    // Transform the parameters to parameters compliant with '$http(config)'
                    // TODO: Créer une méthode '_transformHttpShortcutMethodArguments(arguments)'
                    var updatedArguments = arguments[1]; 
                    updatedArguments.method = 'JSONP';
                    updatedArguments.url = arguments[0];

                    // Delegate the call to '$http(config)'
                    return new $httpWrapper(updatedArguments);
                    
                };
                
                // Overwrite the Angular JS '$http.patch(url, data, [config])' method
                $httpWrapper.patch = function() {
                        
                    // Transform the parameters to parameters compliant with '$http(config)'
                    // TODO: Créer une méthode '_transformHttpShortcutMethodArguments(arguments)'
                    var updatedArguments = arguments[2];
                    updatedArguments.data = arguments[1];
                    updatedArguments.method = 'POST';
                    updatedArguments.url = arguments[0];

                    // Delegate the call to '$http(config)'
                    return new $httpWrapper(updatedArguments);

                };

                return $httpWrapper;
                
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
            
            var requestContext = new OAuth.RequestContext();
            requestContext.originalXhr.xhr = this;
            requestContext.originalXhr.args.open = slicedArguments;

            this.requestContext = requestContext;
            
            // Calls the OAuth.JS 'open' method
            return This._open(requestContext, this, slicedArguments);
            
        };
        
        XMLHttpRequest.prototype.setRequestHeader = function(key, value) {
            
            // Remove the 'callee', 'caller', 'set_callee', 'get_collee', 'set_caller' and 'get_caller' methods
            // This is because the special 'arguments' Javascript object is not an array
            // @see https://developer.mozilla.org/docs/Web/JavaScript/Reference/Fonctions/arguments
            var slicedArguments = [].slice.call(arguments);
            
            this.requestContext.originalXhr.args.setRequestHeader = slicedArguments;
            
            // Calls the OAuth.JS 'setRequestHeader' method
            return This._setRequestHeader(this.requestContext, this, slicedArguments);
            
        };
        
        XMLHttpRequest.prototype.send = function(key, value) {
            
            // Remove the 'callee', 'caller', 'set_callee', 'get_collee', 'set_caller' and 'get_caller' methods
            // This is because the special 'arguments' Javascript object is not an array
            // @see https://developer.mozilla.org/docs/Web/JavaScript/Reference/Fonctions/arguments
            var slicedArguments = [].slice.call(arguments);
            
            this.requestContext.originalXhr.args.send = slicedArguments;

            // Calls the OAuth.JS 'setRequestHeader' method
            return This._send(this.requestContext, this, slicedArguments);
            
        };
        
    },

    _setRequestHeader : function(requestContext, xhr, slicedArguments) {
        
        this._backupedSetRequestHeader.apply(this._realXhr, slicedArguments);

    },

    _send : function(requestContext, xhr, slicedArguments) {

        this._backupedSend.apply(this._realXhr, slicedArguments);
        
    },

    /**
     * Overwritten {@link XMLHttpRequest} open method, this method is a part of what we call the "replaced xhr" object. 
     * The purpose of the replaced xhr is to replace an original {@link XMLHttpRequest} object used by a developer or a 
     * Framework (Backbone, Angular, React, etc.) to intercept server responses and execute actions before returning a 
     * response to the original xhr object.
     * 
     * @param {OAuth.RequestContext} requestContext The {@link RequestContext} object is an object used to keep a trace 
     *        of all the {@link XMLHttpRequest}, parameters and functions used to respond to an original request a 
     *        developer or a Framework (Backbone, Angular, React, etc.) wants to execute.
     * @param {XMLHttpRequest} originalXhr The original {@link XMLHttpRequest} slightly modified to change the behavior 
     *        of some method to let OAuth.JS intercept its actions.
     * @param {Array} openArguments The arguments to pass to the `open()` method of the replaced {@link XMLHttpRequest} 
     *        object.
     */
    // TODO: A tester
    _open : function(requestContext, originalXhr, openArguments) {

        // We create an other XMLHttpRequest object to execute the request
        this._realXhr = new XMLHttpRequest();
        this._realXhr.open = this._backupedOpen;
        this._realXhr.send = this._backupedSend;
        this._realXhr.setRequestHeader = this._backupedSetRequestHeader;

        this._backupedOpen.apply(this._realXhr, openArguments);
        
        var This = this;
        this._realXhr.onreadystatechange = function() {
            
            // @see https://xhr.spec.whatwg.org/#states
            // The data transfer has been completed or something went wrong during the transfer (e.g. infinite redirects
            // ).
            if(this.readyState === XMLHttpRequest.DONE) {

                // Copy all the XMLHttpRequest attribute of the "replaced xhr" to the "original xhr" to propagate its 
                // state 
                OAuth.XhrUtils.copyAttributes(this, originalXhr);
                
                // If the request is a protected OAuth 2.0 Resource Request
                if(originalXhr.isResourceRequest()) {

                    // The server returned a 2xx HTTP Response
                    if(this.status >= 200 && this.status < 300) {
                        
                        if(originalXhr.onreadystatechange) { 
                            originalXhr.onreadystatechange();
                        }
                        
                        if(originalXhr.onload) {
                            originalXhr.onload();
                        }
                        
                    } 
                    
                    // The server returned an other HTTP Response
                    else {
    
                        var action = This._parseErrorFn(originalXhr);
    
                        // The error expresses an OAuth 2.0 Access Token Expired
                        if(action === 'refresh') {
    
                            This._refreshAccessToken(requestContext);
    
                        } 
                        
                        // The error expresses an other kind of error which should be notified to the original 
                        // XMLHttpRequest
                        else {

                            if(originalXhr.onreadystatechange) { 
                                originalXhr.onreadystatechange();
                            }
                            
                            if(originalXhr.onload) {
                                originalXhr.onload();
                            }

                        }
    
                    }
                    
                } 
                
                // Otherwise if the request is a request internal to OAuth.JS we simply delegate the 
                // 'onreadystatechange' call. 
                // Please note that this is very important to not intercept 'sendCredentials' callbacks in the 
                // 'parseErrorFn' function
                else {

                    originalXhr.onreadystatechange();

                }

            }
            
        };

    },
    
    /**
     * Utility function used to update a configuration object passed to the Angular JS `$http(config)` method. The 
     * purpose of this method is to automatically update the URL provided with the arguments to append the OAuth 2.0 
     * 'access_token' URL parameter. The 'access_token' URL parameter is only appended to the URL is the 'secured' 
     * configuration parameter is found.
     * 
     * @param {Object} config A configuration object passed to the Angular JS `$http(config)` method.
     *        
     * @return {Object} The updated configuration object. The provided `config` object is not modified, the returned 
     *         object is a modified copy of the provided `config` object. The returned configuration object has no 
     *         'secured' property because the returned configuration MUST BE 100% compliant with the Angular JS 
     *         framework. The URL could have been updated, this update is only applied if the 'secured' parameter is 
     *         true. If the URL associated to the `config` object already contained an 'access_token' URL parameter then 
     *         its value is updated to the 'access_token' associated to the Storage Manager attached to this Request 
     *         Manager.
     */
    _updateAngularHttpConfig : function(config) {

        var updatedConfig = config;

        // If the AngularJS $http.get(url, config) is called with a 'config' parameter and this 'config' 
        // parameter indicates the request has to be secured
        if(config.secured === true) {

            // Gets the current AuthStatus
            var authStatus = this._storageManager.getAuthStatus();
            
            // Updates the URL to append the 'access_token' parameter
            config.url = OAuth.UrlUtils.addArgument(
                config.url,
                'access_token',
                authStatus.getAccessTokenResponse().getJsonResponse().access_token
            );

        }
        
        // Now the 'secured' parameter is not needed anymore, we delete it because its not useful for Angular  
        delete updatedConfig.secured;
        
        return updatedConfig;

    }

};
