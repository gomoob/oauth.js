OAuth.Request.AngularRequestManager = function(configuration) {
    
    /**
     * The function used to retrieve credentials to get an OAuth 2.0 Access Token.
     */
    this._loginFn = null;
    
    /**
     * The storage manager used to manage persistence of OAuth 2.0 tokens on client side.
     */
    this._storageManager = null;

    // If a specific configuration is provided
    if(typeof configuration === 'object') {

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
        
        // If no OAuth 2.0 Access Token response is stored on client side then the client is considered disconnected
        // So in this case we call the 'loginFn' function
        if(this._storageManager.getAccessTokenResponse() === null) {
    
            // Calls the configured 'loginFn' method, this one will resolve the credentials promise by providing 
            // credentials
            this._loginFn(this._loginContext);
    
            // FIXME: Ici il serait beaucoup plus propre que la credentials promise lève un événement une fois la fin de 
            //        l'exécution de 'sendCredentials' et que le Request Manager écoute cet événement. Ainsi la 
            //        Credentials Promise n'aurait pas à dépendre du Request Manager
    
        }
        
        // Otherwise we directly call the callback.
        else {
            
            loginCb(
                {
                    status : 'connected',
                    authResponse : this._storageManager.getAccessTokenResponse()
                }
            );
            
        }
        
    },
                                                 
    /**
     * Start the AngularJS Request Manager, the purpose of the start method is to overwrites the Angular JS HTTP service 
     * to manage OAuth 2.0 Access Token operations transparently.
     */
    start : function() {
        
        var This = this;
        
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
    
        ajaxPromise.done($.proxy(this._onTokenEndpointPostSuccess, this));
        ajaxPromise.fail($.proxy(this._onTokenEndpointPostError, this));
    */
    },

};
