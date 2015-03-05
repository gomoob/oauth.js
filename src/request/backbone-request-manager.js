/**
 *
 * @author Baptiste GAILLARD (baptiste.gaillard@gomoob.com)
 */ 
OAuth.Request.BackboneRequestManager = function(configuration) {

    /**
     * A reference to the original `Backbone.ajax` method.
     */
    this._backupedBackboneDotAjax = null;
    
    this._loginContext = null;
    
    /**
     * A string which identify the type of client this request manager is overwriting.
     */
    this._clientType = 'backbone';
    
    /**
     * The function used to retrieve credentials to get an OAuth 2.0 Access Token.
     */
    this._loginFn = null;

    /**
     * The function used to parse errors returned by the Web Services.
     */
    this._parseErrorFn = null;

    /**
     * The OAuth 2.0 'client_id' to use.
     */
    this._clientId = null;

    /**
     * The storage manager used to manage persistence of OAuth 2.0 tokens on client side.
     */
    this._storageManager = null;
    
    /**
     * The URL to the token endpoint used to retrieve an access and a refresh token.
     * 
     * @property {String}
     */
    this._tokenEndpoint = null;

    // Backup the global 'Backbone.ajax' method
    if(typeof Backbone !== 'undefined' && Backbone !== null) {
        
        // The existing 'Backbone.ajax' method must exist and being valid
        if(typeof Backbone.ajax !== 'function') {
            
            throw new Error('No valid \'Backbone.ajax\' method has been found !');
            
        }
        
        this._backupedBackboneDotAjax = Backbone.ajax;

    } 
    
    // If no global Backbone is available and no 'Backbone.ajax' method is provided this is an error
    else {
        
        throw new Error('Backbone is not available !');
        
    }

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

OAuth.Request.BackboneRequestManager.prototype = {

    /**
     * Gets the storage manager linked to this request manager.
     * 
     * @returns {StorageManager} The storage manager linked to this request manager.
     */
    getStorageManager : function() {

        return this._storageManager;

    },

    /**
     * Function used to determine if a user is logged in to your application. 
     * 
     * @param {Function} cb
     * @returns {Boolean}
     */
    getLoginStatus : function(cb, forceServerCall) {
        
        // TODO: Pour le moment on utilise pas le tag 'forceServerCall', ce tag est défini de manière à avoir une 
        //       fonction 'getLoginStatus' très similaire à ce que défini le client Facebook FB.getLoginStatus()... Plus 
        //       tard il faudra même que la date côté client soit comparée à la date d'expiration du Token pour voir si 
        //       on considère que le client est connecté ou non...
        // TODO: Il faudrait également que l'on prévoit des événement Javascript de la même manière que ce que fait 
        //       Facebook

        // If no OAuth 2.0 Access Token response is stored on client side then the client is considered disconnected
        if(this._storageManager.getAccessTokenResponse() === null) {
            
            cb(
                {
                    status : 'disconnected'    
                }
            );
            
        } 
        
        // Otherwise the client is considered connected
        else {
        
            cb(
                {
                    status : 'connected',
                    authResponse : this._storageManager.getAccessTokenResponse()
                }
            );

        }

    },
    
    /**
     * Function called when a POST request has been sent on the OAuth 2.0 Token Endpoint and the server returned an
     * error response.
     * 
     * @param jqXHR The jQuery XHR object used to execute the HTTP POST request on the OAuth 2.0 Token endpoint.
     * @param textStatus A string categorizing the status of the request, this is always equal to "success" here.
     * @param errorThrown The textual portion of the HTTP status, such as "Not Found" or "Internal Server Error."
     */
    _onTokenEndpointPostError : function(jqXHR, textStatus, errorThrown) {

        var loginCb = this._loginContext.getLoginCb(),
            loginFnCb = this._loginContext.getLoginFnCb();
        
        // TODO: On doit gérer le cas ou le serveur retourne une réponse qui ne correspond pas du tout au format 
        //       spécifié par OAuth 2.0.

        // If the 'loginFn' function has provided a callback 'loginFnCb' callback
        if(typeof loginFnCb === 'function') {
        
            var deferred = $.Deferred();

            loginFnCb(
                {
                    status : jqXHR.responseJSON.error,
                    authResponse : jqXHR.responseJSON
                },
                function() { deferred.resolve(); }
            );
            
            // When the callback function has ended
            deferred.done(function() {

                loginCb(
                    {
                        status : jqXHR.responseJSON.error,
                        authResponse : jqXHR.responseJSON
                    }
                );

            });

        } 
        
        // Otherwise we call the 'login' function callback directly
        else {

            loginCb(
                {
                    status : jqXHR.responseJSON.error,
                    authResponse : jqXHR.responseJSON
                }
            );

        }

    },
    
    /**
     * Function called when a POST request has been sent on the OAuth 2.0 Token Endpoint and the server returned a 
     * successful response.
     * 
     * @param data The raw data received from server side after posting informations to the OAuth 2.0 Token endpoint.
     * @param textStatus A string categorizing the status of the request, this is always equal to "success" here.
     * @param jqXHR The jQuery XHR object used to execute the HTTP POST request on the OAuth 2.0 Token endpoint.
     */
    _onTokenEndpointPostSuccess : function(data, textStatus, jqXHR) {
        
        var loginCb = this._loginContext.getLoginCb(),
            loginFnCb = this._loginContext.getLoginFnCb();
        
        // TODO: Ici on suppose qu'une réponse HTTP OK du serveur est forcément bonne, hors ce n'est pas forcément le 
        //       cas. On devrait vérifier ici que la réponse est compatible avec le standard OAuth 2.0.

        // Store the refreshed OAuth 2.0 in the local storage
        // WARNING: Please not that besides the standard OAuth 2.0 Access Token informations the 
        //          response also contain a 'user_id' field which is specific to the project and 
        //          contains the technical identifier of the user on the platform
        this._storageManager.persistRawAccessTokenResponse(JSON.stringify(data));
        
        // If the 'loginFn' function has provided a callback to be called after a successful OAuth 2.0 Access Token 
        // retrieval we call it
        if(typeof loginFnCb === 'function') {
        
            var deferred = $.Deferred();

            loginFnCb(
                {
                    status : 'connected',
                    authResponse : data
                },
                function() { deferred.resolve(); }
            );
            
            // When the callback function has ended
            deferred.done(function() {

                loginCb(
                    {
                        status : 'connected',
                        authResponse : data
                    }
                );

            });

        } 
        
        // Otherwise we call the 'login' function callback directly
        else {

            loginCb(
                {
                    status : 'connected',
                    authResponse : data
                }
            );

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

        // If no OAuth 2.0 Access Token response is stored on client side then the client is considered disconnected
        // So in this case we call the 'loginFn' function
        if(this._storageManager.getAccessTokenResponse() === null) {

            // Creates and configures a Login Conext which is then received by the configured 'loginFn' method
            this._loginContext = new OAuth.LoginContext();
            this._loginContext._setLoginCb(loginCb);
            this._loginContext._setLoginOpts(opts);
            this._loginContext._setRequestManager(this);

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
    
    
    logout : function(cb) {
      
        // TODO: A implémenter...
        
    },

    /**
     * Starts the request manager.
     */
    start : function() {
        
        // Closure used to change the context of the overwritten Backbone.ajax function to that it can access the 
        // attributes and methods of this request manager
        var This = this;
        
        // Overwrites the 'Backbone.ajax' method 
        Backbone.ajax = function() { 
            
            return This._overwrittenBackboneDotAjax.apply(This, arguments);

        };

    },
    
    /**
     * Utility function used to clone arguments passed to the jQuery 'ajax' function. Here arguments is the special 
     * Javascript variable which corresponds to the arguments passed to the 'ajax' method inside this method.
     * 
     * @param {array} ajaxArguments The jQuery 'ajax' arguments to clone.
     * 
     * @returns {array} The cloned jQuery 'ajax' arguments.
     * 
     * @see https://developer.mozilla.org/fr/docs/Web/JavaScript/Reference/Fonctions/arguments
     */
    _cloneAjaxArguments : function(ajaxArguments) {

        var clonedAjaxArguments = {};
        
        // The jQuery 'ajax' method has been called with a URL string as first argument
        if(typeof ajaxArguments[0] === 'string') {
            
            clonedAjaxArguments[0] = ajaxArguments[0];
            
            if(clonedAjaxArguments.length === 2) {
                
                clonedAjaxArguments[1] = this._cloneAjaxSettings(ajaxArguments[1]);

            }
            
        } 
        
        // The jQuery 'ajax' method has been called with a settings object as first argument
        else {
        
            clonedAjaxArguments[0] = this._cloneAjaxSettings(ajaxArguments[0]);
            
        }
            
        return clonedAjaxArguments;
        
    },

    /**
     * Utility function used to clone the settings object as a parameter of the jQuery 'ajax' method. This allow to keep 
     * an untouched settings object before modifying it to configure it with an OAuth 2.0 Access Token.
     * 
     * @param {Object} ajaxSettings The jQuery 'ajax' settings object to clone.
     * 
     * @returns {Object} The resulting clone object.
     * 
     * @see http://api.jquery.com/jQuery.ajax
     */
    _cloneAjaxSettings : function(ajaxSettings) {
        
        // see http://api.jquery.com/jQuery.ajax to know what are the names of the properties allowed by the jQuery 
        // 'ajax' settings object
        var settingsAttributes = [
            'accepts',
            'async',
            'beforeSend',
            'cache',
            'complete',
            'contents',
            'contentType',
            'context',
            'converters',
            'crossDomain',
            'data',
            'dataFilter',
            'dataType',
            'error',
            'global',
            'headers',
            'isModified',
            'isLocal',
            'jsonp',
            'jsonpCallback',
            'mimeType',
            'password',
            'processData',
            'scriptCharset',
            'statusCode',
            'success',
            'timeout',
            'traditional',
            'type',
            'url',
            'username',
            'xhr',
            'xhrFields'
        ];
        
        var clonedAjaxSettings = {};
        
        for(var i = 0; i < settingsAttributes.length; ++i) {
        
            if(typeof ajaxSettings[settingsAttributes[i]] !== 'undefined') {
                
                clonedAjaxSettings[settingsAttributes[i]] = ajaxSettings[settingsAttributes[i]];
            
            }
        
        }
        
        return clonedAjaxSettings;
        
    },
    
    /**
     * Utility function used to create an OAuth 2.0 promise which is similar to a jQuery AJAX promise and which is 
     * returned by the overwritten AJAX method. This function allows the created OAuth 2.0 promise to has the same 
     * functions and properties as the promise returned by '$.ajax()'.
     * 
     * @param {jqXHR} jQueryAjaxPromise The jQuery AJAX promise to call and from which one to copy properties and 
     *        delegate function calls.
     * @returns {jqXHR} A new promise which is very similar to the provide jQuery AJAX promise.
     * 
     * @see https://github.com/jquery/jquery/blob/master/src/ajax.js
     */
    _createOAuthPromise : function(jQueryAjaxPromise) {
        
        var oAuthPromise = $.Deferred();
        
        // Builds headers hashtable if needed
        oAuthPromise.getResponseHeader = function(key) {
            return jQueryAjaxPromise.getResponseHeader(key);    
        };
        
        // Raw string
        oAuthPromise.getAllResponseHeaders = function() {
            return jQueryAjaxPromise.getAllResponseHeaders();
        };
        
        // Caches the header
        oAuthPromise.setRequestHeader = function(name, value) {
            jQueryAjaxPromise.setRequestHeader(name, value);
            return this;
        };
        
        // Overrides response content-type header
        oAuthPromise.overrideMimeType = function(type) {
            jQueryAjaxPromise.overrideMimeType(type);
            return this;
        };
        
        // Status-dependent callbacks
        oAuthPromise.statusCode = function(map) {
            jQueryAjaxPromise.statusCode(map);
            return this;
        };
        
        // Cancel the request
        oAuthPromise.abort = function(statusText) {
            jQueryAjaxPromise.abort(statusText);
            return this;
        };
        
        oAuthPromise.success = oAuthPromise.done;
        oAuthPromise.error = oAuthPromise.fail;
        
        oAuthPromise.readyState = jQueryAjaxPromise.readyState;
        oAuthPromise.status = jQueryAjaxPromise.status;
        oAuthPromise.statusText = jQueryAjaxPromise.statusText;

        return oAuthPromise;
        
    },
    
    /**
     * Function called when a request to a Web Service is successful.
     * 
     * @param {array} originalAjaxArguments The arguments passed to the overwrittent Backbone.ajax method.
     * @param {jQuery.Deferred} oauthPromise A jQuery promise object resolved when the original Web Service request is 
     *        successful.
     * @param {Object} data The data returned from the Web Service.
     * @param {string} textStatus The status of the HTTP request.
     * @param {XMLHttpRequest} jqXHR The XML HTTP request object used to do the request.
     */
    _jQueryAjaxPromiseDone : function(originalAjaxArguments, oauthPromise, data, textStatus, jqXHR) {

        // Resolves the OAuth promise wih exactly the same arguments as those passes to the resolve function of the 
        // promise return by 'Backbone.ajax'
        oauthPromise.resolve(data, textStatus, jqXHR);

    },

    /**
     * Function called when a request to a Web Service has failed. This function inspects the error response by parsing 
     * it with an error parser. If the parser returns 'refresh' then the Access Token is refreshed, if the parser 
     * returns 'reniew' then the Access Token is reniewed. In all other cases the wrapping Ajax promise is rejected with 
     * the encountered error.
     * 
     * @param {array} originalAjaxArguments The arguments passed to the overwrittent Backbone.ajax method.
     * @param {jQuery.Deferred} oauthPromise A jQuery promise object resolved when the original Web Service request is 
     *        successful.
     * @param {XMLHttpRequest} jqXHR The jQuery XML HTTP request which failed.
     * @param {string} status The status of the error.
     * @param {string} errorThrown The error thrown.
     */
    _jQueryAjaxPromiseFail : function(originalAjaxArguments, oauthPromise, jqXHR, status, errorThrown) {

        // Parse the received error to know if its a known OAuth 2.0 error
        var action = this._parseErrorFn(jqXHR);
        
        // If the parse result is not 'undefined' then this is a known OAuth 2.0 error
        if(action !== undefined) {
            
            switch(action) {
                case 'refresh' :
                    
                    // Refresh the Access Token, if the refresh is successful then the promise will be resolved, 
                    // otherwise the promise will be rejected
                    this._refreshAccessToken(originalAjaxArguments, oauthPromise);
                    break;

                case 'reniew' :
                
                    // Reniew the Access Token, if the reniewal is successful then the promise will be resolved, 
                    // otherwise the promise will be rejected
                    this._reniewAccessToken(originalAjaxArguments, oauthPromise);
                    break;

                default:
                    throw new Error('Action \'' + action + '\' is invalid !');
            }

        } 
        
        // Otherwise we are on an other kind of error
        else {
            
            // Rejects the OAuth promise with exactly the same arguments as those passed to the reject method call on 
            // the promise returned by 'Backbone.ajax' 
            oauthPromise.reject(jqXHR, status, errorThrown);

        }

    },
    
    /**
     * Utility function used to modify the settings object passed to the jQuery 'ajax' method by adding to it an OAuth 
     * 2.0 Access Token URL parameter.
     * 
     * @param {array} ajaxArguments The Javascript arguments variable get inside the overwritten Backbone.ajax method.
     */
    _updateAjaxArgumentsWithAccessToken : function(ajaxArguments) {
        
        // Try to get an OAuth 2.0 Access Token from the client storage
        var accessToken = this._storageManager.getAccessToken();
        
        // Appends the 'access_token' URL parameter
        if(accessToken && ajaxArguments[0].secured) {

            // The '$.ajax' method is called with a URL directly provided
            if(typeof ajaxArguments[0] === 'string') {
                
                /* jshint ignore:start */
                ajaxArguments[0] += ajaxArguments[0].indexOf('?') === -1 ? '?' : '&';
                ajaxArguments[0] += 'access_token';
                ajaxArguments[0] += '=';
                ajaxArguments[0] += accessToken;
                /* jshint ignore:end */

            }
            
            // The '$.ajax' method is called with a URL inside a configuration object
            else {
    
                ajaxArguments[0].url += ajaxArguments[0].url.indexOf('?') === -1 ? '?' : '&';
                ajaxArguments[0].url += 'access_token';
                ajaxArguments[0].url += '=';
                ajaxArguments[0].url += accessToken;

            }

        }
        
    },

    /**
     * The overwritten 'Backbone.ajax' method.
     * 
     * @returns {$.Deferred} A JQuery promise which is resolved when the secured Web Service request has been 
     *          successfully executed. This promise is rejected if the Web Service returns an error which does not 
     *          corresponds to a 'refresh' or 'reniew' action.
     */
    _overwrittenBackboneDotAjax : function() {

        // The original AJAX arguments describes the initial user request
        var originalAjaxArguments = this._cloneAjaxArguments(arguments);
        
        // Updates the AJAX arguments by adding the OAuth 2.0 Access Token stored in the client storage
        this._updateAjaxArgumentsWithAccessToken(arguments);

        // The promise used to directly request the Web Service is not the returned promise. The returned promise is an 
        // other promise which is rejected when we are sure an Access Token refresh or reniewal is not useful to solve 
        // the problem. 
        var jQueryAjaxPromise = Backbone.$.ajax.apply(Backbone.$, arguments), 
            oAuthPromise = this._createOAuthPromise(jQueryAjaxPromise);

        // The fail callback has 2 different behaviors
        //  - If the response returned from the server indicates that the OAuth 2.0 Access Token is expired or needs a 
        //    reniewal then the refresh or reniew operation is done before calling 'Backbone.ajax' again with this URL
        //  - If the response returned is not associated to OAuth 2.0 or cannot be solved using an Access Token refresh 
        //    or reniewal then this callback rejects the returned promise
        jQueryAjaxPromise.fail($.proxy(this._jQueryAjaxPromiseFail, this, originalAjaxArguments, oAuthPromise));
        jQueryAjaxPromise.done($.proxy(this._jQueryAjaxPromiseDone, this, originalAjaxArguments, oAuthPromise));

        return oAuthPromise;
    
    },
    
    /**
     * Callback function called after an OAuth 2.0 Access Token has been successfully refreshed or reniewed and the 
     * original Web Service request has been replayed successfully.
     * 
     * @param {$.Deferred} oAuthPromise The jQuery promise resolved when the original Web Service request has been 
     *        successfully executed or rejected when the original Web Service request returns an error.
     * @param {Object} data The data returned by the original Web Service request.
     * @param {string} textStatus Always 'success' here because we are on the promise success callback.
     * @param {jqXHR} jqXHR The jquery XMLHttpRequest object used to execute the request.
     */
    _onOriginalRequestReplayedDone : function(oAuthPromise, data, textStatus, jqXHR) {
        
        oAuthPromise.resolve(data, textStatus, jqXHR);
        
    },
    
    /**
     * Callback function called after an OAuth 2.0 Access Token has been successfully refreshed or reniewed and the 
     * original Web Service request has been replayed with an error.
     * 
     * @param {$.Deferred} oAuthPromise The jQuery promise resolved when the original Web Service request has been 
     *        successfully executed or rejected when the original Web Service request returns an error.
     * @param {Object} data The data returned by the original Web Service request.
     * @param {string} textStatus Always 'success' here because we are on the promise success callback.
     * @param {jqXHR} jqXHR The jquery XMLHttpRequest object used to execute the request.
     */
    _onOriginalRequestReplayedFail : function(oAuthPromise, jqXHR, status, errorThrown) {
        
        oAuthPromise.reject(jqXHR, status, errorThrown);
        
    },
    
    /**
     * Callback function called when the refresh of an OAuth 2.0 Access Token is successful.
     * 
     * @param {array} originalAjaxArguments The arguments passed to the overwritten Backbone.ajax method.
     * @param {jQuery.Deferred} oAuthPromise A jQuery promise object resolved when the original Web Service request is 
     *        successful.
     * @param {Object} data The data returned from the OAuth 2.0 token endpoint.
     * @param {string} textStatus The status of the HTTP token refresh request.
     * @param {XMLHttpRequest} jqXHR The XML HTTP request object used to execute the token refresh request.
     */
    _onRefreshAccessTokenSuccess : function(originalAjaxArguments, oAuthPromise, data, textStatus, jqXHR) {
        
        // Store the refresed OAuth 2.0 in the local storage
        // WARNING: Please not that besides the standard OAuth 2.0 Access Token informations the 
        //          response also contain a 'user_id' field which is specific to the project and 
        //          contains the technical identifier of the user on the platform
        this._storageManager.persistRawAccessTokenResponse(JSON.stringify(data));

        var overwittenAjaxArguments = this._cloneAjaxArguments(originalAjaxArguments);
        overwittenAjaxArguments[0].secured = true; // TODO: Ceci devrait être dans le RequestContext
        
        // Updates the AJAX arguments by adding the OAuth 2.0 Access Token stored in the client storage
        // FIXME: Ici il se peut que les arguments AJAX aient déjà un token OAuth 2.0 et qu'il faille le remplacer....
        this._updateAjaxArgumentsWithAccessToken(overwittenAjaxArguments);
        
        // Re-executes the orginial request
        var ajaxPromise = $.ajax(overwittenAjaxArguments[0]);
        ajaxPromise.done($.proxy(this._onOriginalRequestReplayedDone, this, oAuthPromise));
        ajaxPromise.fail($.proxy(this._onOriginalRequestReplayedFail, this, oAuthPromise));

    },
    
    /**
     * Callback function called when the reniewal of an OAuth 2.0 Access Token is successful.
     * 
     * @param {array} originalAjaxArguments The arguments passed to the overwritten Backbone.ajax method.
     * @param {jQuery.Deferred} oAuthPromise A jQuery promise object resolved when the original Web Service request is 
     *        successful.
     * @param {Object} data The data returned from the OAuth 2.0 token endpoint.
     * @param {string} textStatus The status of the HTTP token refresh request.
     * @param {XMLHttpRequest} jqXHR The XML HTTP request object used to execute the token refresh request.
     */
    _onReniewAccessTokenSuccess : function(originalAjaxArguments, oAuthPromise, data, textStatus, jqXHR) {
        
        // Store the refresed OAuth 2.0 in the local storage
        // WARNING: Please not that besides the standard OAuth 2.0 Access Token informations the 
        //          response also contain a 'user_id' field which is specific to the project and 
        //          contains the technical identifier of the user on the platform
        this._storageManager.persistRawAccessTokenResponse(JSON.stringify(data));

        // Re-executes the orginial request
        var ajaxPromise = $.ajax(originalAjaxArguments);
        ajaxPromise.done($.proxy(this._onOriginalRequestReplayedDone, this, oAuthPromise));
        ajaxPromise.fail($.proxy(this._onOriginalRequestReplayedFail, this, oAuthPromise));

    },
    
    /**
     * Function used to refresh the OAuth 2.0 Access Token using the refresh token stored in the associated storage.
     * 
     * @param {array} originalAjaxArguments The arguments passed to the overwritten Backbone.ajax method.
     * @param {jQuery.Deferred} oAuthPromise A jQuery promise object resolved when the original Web Service request is 
     *        successful.
     */
    _refreshAccessToken : function(originalAjaxArguments, oAuthPromise) {
        
        // Try to get an OAuth 2.0 Refresh Token from the client storage
        var refreshToken = this._storageManager.getRefreshToken();
        
        // If a refresh token is stored on the client storage we try to refresh the access token using this refresh 
        // token
        if(refreshToken) {

            var ajaxPromise = $.ajax(
                {
                    url : this._tokenEndpoint, 
                    data : {
                        grant_type : 'refresh_token', 
                        refresh_token : refreshToken,
                        client_id : this._clientId
                    }, 
                    dataType : 'json',
                    type: 'POST'
                }
            );
            ajaxPromise.fail($.proxy(this._reniewAccessToken, this, oAuthPromise));
            ajaxPromise.done($.proxy(this._onRefreshAccessTokenSuccess, this, originalAjaxArguments, oAuthPromise));

        }

        // Otherwise we try to reniew the access token
        else {

            this._reniewAccessToken(originalAjaxArguments, oAuthPromise);

        }

    }, 
    
    /**
     * Function used to reniew the OAuth 2.0 Access Token using the refresh token stored in the associated storage.
     * 
     * @param {array} originalAjaxArguments The arguments passed to the overwritten Backbone.ajax method.
     * @param {jQuery.Deferred} oAuthPromise A jQuery promise object resolved when the original Web Service request is 
     *        successful.
     */
    _reniewAccessToken : function(originalAjaxArguments, oAuthPromise) {

        // If the Login Context is not initialized then it means that login has been done which is forbidden
        if(this._loginContext === null) {

            throw new Error('No login context found, did you miss to wrap your calls in \'OAuth.login\' ?');

        }

        console.log('_reniewAccessToken');
        
        // TODO: Créer un modèle de récupération de login / mdp ou credentials

        // A jQuery promise resolved when the 'loginFn' function calls the 'login' method of the Credentials Promise
        var deferred = $.Deferred();
        
        // Creates and configures a Login Context which is then received by the configured 'loginFn' method
        // var loginContext = new OAuth.LoginContext();
        // loginContext._setLoginCb(loginCb);
        // loginContext._setLoginOpts(opts);
        this._loginContext._setRequestManager(this);
        
        this._loginFn(this._loginContext);

        deferred.done($.proxy(this._onCredentialsPromiseDone, this, originalAjaxArguments, oAuthPromise));
        deferred.fail($.proxy(function() {
            
            // TODO: Erreur à gérer correctement
            console.log('_reniewAccessToken Error !');
            
        }, this));
        
        /*
        var deferred = $.Deferred(),
            loginContext = function(credentials, callback) {
                deferred.resolve(credentials, callback);
            };

        this._loginFn(loginContext);

        deferred.done($.proxy(this._onCredentialsPromiseDone, this, originalAjaxArguments, oAuthPromise));
        deferred.fail(function() {
            
            // TODO: ???

        });
        */
        
    }, 
    
    _onCredentialsPromiseDone : function(originalAjaxArguments, oauthPromise, credentialsSettings) {

        switch(credentialsSettings.grant_type) {
            
            // Resource Owner Password Credentials
            // see: http://tools.ietf.org/html/rfc6749#section-1.3.3
            // see: http://tools.ietf.org/html/rfc6749#section-4.3
            case 'password':
                var ajaxPromise = $.ajax(
                    {
                        contentType : 'application/x-www-form-urlencoded; charset=UTF-8',
                        data : {
                            grant_type : 'password',
                            username : credentialsSettings.username,
                            password : credentialsSettings.password,
                            client_id : this._clientId
                        },
                        type : 'POST',
                        url: this._tokenEndpoint
                    }
                );
                ajaxPromise.done($.proxy(this._onReniewAccessTokenSuccess, this, originalAjaxArguments, oauthPromise));
                
                // TODO: Echec complet ???
                // ajaxPromise.fail($.proxy(this._onOriginalRequestReplayedFail, this, oauthPromise));
                break;
                
            // Client Credentials
            // see: http://tools.ietf.org/html/rfc6749#section-1.3.4
            // see: http://tools.ietf.org/html/rfc6749#section-4.4
            case 'client_credentials':
                $.ajax(
                    {
                        contentType : 'application/x-www-form-urlencoded; charset=UTF-8',
                        data : {
                            grant_type : 'client_credentials',
                            client_id : this._clientId
                        },
                        type : 'POST',
                        url: this._tokenEndpoint        
                    }
                );
                break;
        }
        
    }

};