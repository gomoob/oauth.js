/**
 *
 * @author Baptiste GAILLARD (baptiste.gaillard@gomoob.com)
 */ 
BackboneRequestManager = function(configuration) {
    
    /**
     * A reference to the original `Backbone.ajax` method.
     */
    this._backupedBackboneDotAjax = null;
    
    /**
     * A string which identify the type of client this request manager is overwriting.
     */
    this._clientType = 'backbone';

    /**
     * The error parser used to manage errors returned by the Web Services.
     */
    this._errorParser = null;

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

        if(typeof configuration.errorParser !== 'undefined') {
            
            this._errorParser = configuration.errorParser;
            
        } else {
        
            this._errorParser = new ErrorParser();
        
        }

        this._storageManager = new StorageManager({
            storage : configuration.storage,
            storageKey : configuration.storageKey
        });
        
    } 
    
    // Otherwise the request manager uses a default configuration
    else {

        this._errorParser = new ErrorParser();
        this._storageManager = new StorageManager();
        
    }
};

BackboneRequestManager.prototype = {

    /**
     * Gets the storage manager linked to this request manager.
     * 
     * @returns {StorageManager} The storage manager linked to this request manager.
     */
    getStorageManager : function() {

        return this._storageManager;

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
     * Function called when a request to a Web Service is successful.
     * 
     * @param {Object} data The data returned from the Web Service.
     * @param {string} textStatus The status of the HTTP request.
     * @param {XMLHttpRequest} jqXHR The XML HTTP request object used to do the request.
     * @param {jQuery.Deferred} oauthPromise A jQuery promise object resolved when a Web Service request is successful.
     */
    _jQueryAjaxPromiseDone : function(originalAjaxArgs, oauthPromise, data, textStatus, jqXHR) {

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
     * @param {XMLHttpRequest} jqXHR The jQuery XML HTTP request which failed.
     * @param {string} status The status of the error.
     * @param {string} errorThrown The error thrown.
     */
    _jQueryAjaxPromiseFail : function(originalAjaxArgs, oauthPromise, jqXHR, status, errorThrown) {

        // Parse the received error to know if its a known OAuth 2.0 error
        var action = this._errorParser.parse(jqXHR);
        
        // If the parse result is not 'undefined' then this is a known OAuth 2.0 error
        if(action !== undefined) {
            
            switch(action) {
                case 'refresh' :
                    
                    // Refresh the Access Token, if the refresh is successful then the promise will be resolved, 
                    // otherwise the promise will be rejected
                    this._refreshAccessToken(originalAjaxArgs, oauthPromise);
                    break;

                case 'reniew' :
                
                    // Reniew the Access Token, if the reniewal is successful then the promise will be resolved, 
                    // otherwise the promise will be rejected
                    this._reniewAccessToken(originalAjaxArgs, oauthPromise);
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
    
    _cloneAjaxSettings : function(ajaxSettings) {
        
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
     * The overwritten 'Backbone.ajax' method.
     * 
     * @returns {$.Deferred} a JQuery promise.
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
    
    _onOriginalAjaxReplayedDone : function(oAuthPromise, data, textStatus, jqXHR) {
        
        oAuthPromise.resolve(data, textStatus, jqXHR);
        
    },
    
    _onOriginalAjaxReplayedFail : function(oAuthPromise, jqXHR, status, errorThrown) {
        
        oAuthPromise.reject(jqXHR, status, errorThrown);
        
    },
    
    _onRefreshAccessTokenSuccess : function(originalAjaxArgs, oauthPromise, data, textStatus, jqXHR) {
        
        // Store the refresed OAuth 2.0 in the local storage
        // WARNING: Please not that besides the standard OAuth 2.0 Access Token informations the 
        //          response also contain a 'user_id' field which is specific to the project and 
        //          contains the technical identifier of the user on the platform
        this._storageManager.persistRawAccessTokenResponse(JSON.stringify(data));

        // Re-executes the orginial request
        var ajaxPromise = $.ajax(originalAjaxArgs);
        ajaxPromise.done($.proxy(this._onOriginalAjaxReplayedDone, this, oauthPromise));
        ajaxPromise.fail($.proxy(this._onOriginalAjaxReplayedFail, this, oauthPromise));

    },
    
    /**
     * Function used to refresh the Access Token using the refresh token stored in the associated storage.
     */
    _refreshAccessToken : function(originalAjaxArgs, oauthPromise) {
        
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
            ajaxPromise.done($.proxy(this._onRefreshAccessTokenSuccess, this, originalAjaxArgs, oauthPromise));

        }

        // Otherwise we try to reniew the access token
        else {

            this._reniewAccessToken(originalAjaxArgs, oauthPromise);

        }

    }, 
    
    _reniewAccessToken : function(originalAjaxArgs, oauthPromise) {
        
        console.log('_reniewAccessToken');
        
        // TODO: Créer un modèle de récupération de login / mdp ou credentials

    }

};