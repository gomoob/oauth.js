/**
 *
 * @author Baptiste GAILLARD (baptiste.gaillard@gomoob.com)
 */ 
OAuth.Request.BackboneRequestManager = function(configuration) {

    /**
     * A reference to the original `Backbone.ajax` method.
     */
    this._backupedBackboneDotAjax = null;
    
    /**
     * A string which identify the type of client this request manager is overwriting.
     */
    this._clientType = 'backbone';
    
    /**
     * The function used to retrieve credentials to get an OAuth 2.0 Access Token.
     */
    this._loginFn = null;

    /**
     * The error parser used to manage errors returned by the Web Services.
     */
    this._errorParser = null;

    /**
     * The OAuth 2.0 Grant Type used by the request manager to acquire Access Tokens.
     */
    this._grantType = null;

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

        // The grant type is required
        if(typeof configuration.grantType === 'undefined') {

            throw new Error('No grant type is provided !');

        }

        this._grantType = configuration.grantType;

        // The token endpoint is required
        if(typeof configuration.tokenEndpoint !== 'string') {
            
            throw new Error('No token endpoint is provided or its valued is invalid !');
            
        }
        
        this._tokenEndpoint = configuration.tokenEndpoint;

        // If a specific error parser is provided we use it
        if(typeof configuration.errorParser !== 'undefined') {
            
            this._errorParser = configuration.errorParser;
            
        } 
        
        // Otherwise we use the default error parser
        else {
        
            this._errorParser = new OAuth.Error.DefaultErrorParser();
        
        }

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
    
    _onLoginError : function(options) {
        
        
        
    },
    
    _onLoginSuccess : function(cb, credentials) {
        
        var ajaxPromise = $.ajax(
            {
                contentType : 'application/x-www-form-urlencoded; charset=UTF-8',
                data : {
                    grant_type : this._grantType.grant_type,
                    client_id : this._grantType.client_id,
                    username : credentials.username,
                    password : credentials.password
                },
                type : 'POST',
                url: this._tokenEndpoint        
            }
        );
        ajaxPromise.done($.proxy(function(data, textStatus, jqXHR) {

            // Store the refresed OAuth 2.0 in the local storage
            // WARNING: Please not that besides the standard OAuth 2.0 Access Token informations the 
            //          response also contain a 'user_id' field which is specific to the project and 
            //          contains the technical identifier of the user on the platform
            this._storageManager.persistRawAccessTokenResponse(JSON.stringify(data));
            
            cb(
                {
                    status : 'connected',
                    authResponse : data
                }
            );

        }, this));
        
        // TODO: Gestion des erreurs...

    },
    
    /**
     * Function used to login a user, by default this function checks if the user is already logged in, if it is the 
     * configured 'loginFn' function is not called and the provided callback is directly called. Otherwise the 'loginFn' 
     * function is called before calling the provided callback. 
     * 
     * @param cb A callback function to be called when a login action has been done.
     * @param opts Options used to configure the login.
     */
    login : function(cb, opts) {

        // If no OAuth 2.0 Access Token response is stored on client side then the client is considered disconnected
        // So in this case we call the 'loginFn' function
        if(this._storageManager.getAccessTokenResponse() === null) {

            var credentialsPromise = $.Deferred();
            this._loginFn(credentialsPromise);
            credentialsPromise.done($.proxy(this._onLoginSuccess, this, cb));
            credentialsPromise.fail($.proxy(this._onLoginError, this, cb));

        }
        
        // Otherwise we directly call the callback.
        else {
            
            cb(
                {
                    status : 'connected',
                    authResponse : this._storageManager.getAccessTokenResponse()
                }
            );
            
        }
        
    },
    
    logout : function(cb) {
      

        
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
        var action = this._errorParser.parse(jqXHR);
        
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
        if(accessToken) {

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
            oauthPromise = $.Deferred();

        // The fail callback has 2 different behaviors
        //  - If the response returned from the server indicates that the OAuth 2.0 Access Token is expired or needs a 
        //    reniewal then the refresh or reniew operation is done before calling 'Backbone.ajax' again with this URL
        //  - If the response returned is not associated to OAuth 2.0 or cannot be solved using an Access Token refresh 
        //    or reniewal then this callback rejects the returned promise
        jQueryAjaxPromise.fail($.proxy(this._jQueryAjaxPromiseFail, this, originalAjaxArguments, oauthPromise));
        jQueryAjaxPromise.done($.proxy(this._jQueryAjaxPromiseDone, this, originalAjaxArguments, oauthPromise));

        return oauthPromise;
    
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
     * @param {jQuery.Deferred} oauthPromise A jQuery promise object resolved when the original Web Service request is 
     *        successful.
     * @param {Object} data The data returned from the OAuth 2.0 token endpoint.
     * @param {string} textStatus The status of the HTTP token refresh request.
     * @param {XMLHttpRequest} jqXHR The XML HTTP request object used to execute the token refresh request.
     */
    _onRefreshAccessTokenSuccess : function(originalAjaxArguments, oauthPromise, data, textStatus, jqXHR) {
        
        // Store the refresed OAuth 2.0 in the local storage
        // WARNING: Please not that besides the standard OAuth 2.0 Access Token informations the 
        //          response also contain a 'user_id' field which is specific to the project and 
        //          contains the technical identifier of the user on the platform
        this._storageManager.persistRawAccessTokenResponse(JSON.stringify(data));

        // Re-executes the orginial request
        var ajaxPromise = $.ajax(originalAjaxArguments);
        ajaxPromise.done($.proxy(this._onOriginalRequestReplayedDone, this, oauthPromise));
        ajaxPromise.fail($.proxy(this._onOriginalRequestReplayedFail, this, oauthPromise));

    },
    
    /**
     * Callback function called when the reniewal of an OAuth 2.0 Access Token is successful.
     * 
     * @param {array} originalAjaxArguments The arguments passed to the overwritten Backbone.ajax method.
     * @param {jQuery.Deferred} oauthPromise A jQuery promise object resolved when the original Web Service request is 
     *        successful.
     * @param {Object} data The data returned from the OAuth 2.0 token endpoint.
     * @param {string} textStatus The status of the HTTP token refresh request.
     * @param {XMLHttpRequest} jqXHR The XML HTTP request object used to execute the token refresh request.
     */
    _onReniewAccessTokenSuccess : function(originalAjaxArguments, oauthPromise, data, textStatus, jqXHR) {
        
        // Store the refresed OAuth 2.0 in the local storage
        // WARNING: Please not that besides the standard OAuth 2.0 Access Token informations the 
        //          response also contain a 'user_id' field which is specific to the project and 
        //          contains the technical identifier of the user on the platform
        this._storageManager.persistRawAccessTokenResponse(JSON.stringify(data));

        // Re-executes the orginial request
        var ajaxPromise = $.ajax(originalAjaxArguments);
        ajaxPromise.done($.proxy(this._onOriginalRequestReplayedDone, this, oauthPromise));
        ajaxPromise.fail($.proxy(this._onOriginalRequestReplayedFail, this, oauthPromise));

    },
    
    /**
     * Function used to refresh the OAuth 2.0 Access Token using the refresh token stored in the associated storage.
     * 
     * @param {array} originalAjaxArguments The arguments passed to the overwritten Backbone.ajax method.
     * @param {jQuery.Deferred} oauthPromise A jQuery promise object resolved when the original Web Service request is 
     *        successful.
     */
    _refreshAccessToken : function(originalAjaxArguments, oauthPromise) {
        
        // Try to get an OAuth 2.0 Refresh Token from the client storage
        var refreshToken = this._storageManager.getRefreshToken();
        
        // If a refresh token is stored on the client storage we try to refresh the access token using this refresh 
        // token
        if(refreshToken) {

            var ajaxPromise = $.ajax(
                {
                    url : this._tokenEndpoint, 
                    data : { 'grant_type' : 'refresh_token', 'refresh_token' : refreshToken }, 
                    dataType : 'json',
                    type: 'POST'
                }
            );
            ajaxPromise.fail($.proxy(this._reniewAccessToken, this, oauthPromise));
            ajaxPromise.done($.proxy(this._onRefreshAccessTokenSuccess, this, originalAjaxArguments, oauthPromise));

        }

        // Otherwise we try to reniew the access token
        else {

            this._reniewAccessToken(originalAjaxArguments, oauthPromise);

        }

    }, 
    
    /**
     * Function used to reniew the OAuth 2.0 Access Token using the refresh token stored in the associated storage.
     * 
     * @param {array} originalAjaxArguments The arguments passed to the overwritten Backbone.ajax method.
     * @param {jQuery.Deferred} oauthPromise A jQuery promise object resolved when the original Web Service request is 
     *        successful.
     */
    _reniewAccessToken : function(originalAjaxArguments, oauthPromise) {
        
        console.log('_reniewAccessToken');
        
        // TODO: Créer un modèle de récupération de login / mdp ou credentials

        var credentialsPromise = $.Deferred();

        this._loginFn(credentialsPromise);

        credentialsPromise.done($.proxy(this._onCredentialsPromiseDone, this, originalAjaxArguments, oauthPromise));
        credentialsPromise.fail(function() {
            
        });
        
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
                            password : credentialsSettings.password
                        },
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
                        },
                        url: this._tokenEndpoint        
                    }
                );
                break;
        }
        
    }

};