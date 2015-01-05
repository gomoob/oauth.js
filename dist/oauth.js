ErrorParser = function() {};
ErrorParser.prototype = {
    
    parse : function(xMLHttpRequest) {

        // If we are on a 401 HTTP error response (i.e Unauthorized)
        if(xMLHttpRequest.status === 401) {
            
            switch(xMLHttpRequest.responseText) {    
                case 'token_expired':
                    return 'refresh';
                case 'token_invalid':
                    return 'reniew';
            }

        }

    }

};
/**
 * 
 * @author Baptiste GAILLARD (baptiste.gaillard@gomoob.com)
 */
OAuth2Client = function(configuration) {

    /**
     * An object used to store Access Token Responses on client side.
     * 
     * @property {AccessTokenResponse}
     */
    this._accessTokenResponseStorage = null;

    /**
     * The URL to the token endpoint used to retrieve an access and a refresh token.
     * 
     * @property {String}
     */
    this._tokenEndpoint = null;

    // The configuration object is expected
    if(typeof configuration !== 'object') {

        throw new Error('A configuration object is required !');

    }
    
    // The token endpoint is expected
    if(typeof configuration.tokenEndpoint !== 'string') {
        
        throw new Error('A token endpoint is required !');
        
    }
    
    this._tokenEndpoint = configuration.tokenEndpoint;

    this._accessTokenResponseStorage = new AccessTokenResponseStorage(configuration);

};

OAuth2Client.prototype = {

    _backupedBackboneDotAjax : null,
    
    
};
/**
 * 
 * @author Baptiste GAILLARD (baptiste.gaillard@gomoob.com)
 */
StorageManager = function(configuration) {
    
    /**
     * The storage used to store the Access Token Response, 2 kinds of storage are supported. 
     * 
     *  * 'local'   : To use the browser local storage.
     *  * 'session' : To use the browser session storage.
     *  
     * @property {Storage}
     */
    this._storage = localStorage;
    
    /**
     * The key used to store the Access Token Response inside the Web Storage.
     * 
     * @param {String}
     */
    this._storageKey = 'oauth.js';

    // If no Web Storage is available in the browser
    if(typeof Storage === 'undefined') {

        throw new Error('Your browser does not support HTML5 Web Storage !');

    }
    
    // If a specific configuration is provided
    if(typeof configuration === 'object') {
     
        // Configure the storage to use
        switch(configuration.storage) {
            case 'local':
            case null:
            case undefined:
                this._storage = localStorage;
                break;
            case 'session':
                this._storage = sessionStorage;
                break;
            default:
                throw new Error('Invalid storage value provided !');
        }
        
        // Configure the storage key
        this._storageKey = typeof configuration.storageKey === 'string' ? configuration.storageKey : 'oauth.js';

    }
    
};

StorageManager.prototype = {

    /**
     * Gets the last Access Token stored.
     * 
     * @return {String} The last Access Token stored or null if no Access Token is stored.
     */
    getAccessToken : function() {
        
        var accessTokenResponse = this.getAccessTokenResponse(), 
            accessToken = accessTokenResponse !== null ? accessTokenResponse.access_token : null;
        
        // Returns null or a valid token (undefined is always converted to null)
        return accessToken === null || accessToken === undefined ? null : accessToken;

    },

    /**
     * Gets the last Access Token Response stored.
     * 
     * @param {AccessTokenResponse} The last Access Token Response stored. 
     */
    getAccessTokenResponse : function() {
        
        var rawAccessTokenResponse = this._storage.getItem(this._storageKey + '.accessTokenResponse');

        return rawAccessTokenResponse !== null ? JSON.parse(rawAccessTokenResponse) : null;

    },

    /**
     * Gets the last Refresh Token stored.
     * 
     * @return {String} The last Refresh Token stored.
     */
    getRefreshToken : function() {
        
        var accessTokenResponse = this.getAccessTokenResponse(), 
            refreshToken = accessTokenResponse !== null ? accessTokenResponse.refresh_token : null;

        // Returns null or a valid token (undefined is always converted to null)
        return refreshToken === null || refreshToken === undefined ? null : refreshToken;

    },

    /**
     * Persists the Raw Access Token Response.
     * 
     * @param {String} rawAccessTokenResponse The raw Access Token Response returned from the server, this must be a raw 
     *        string.
     */
    persistRawAccessTokenResponse : function(rawAccessTokenResponse) {
        
        this._storage.setItem(this._storageKey + '.accessTokenResponse', rawAccessTokenResponse);

    }
    
};
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
     * 
     * @param jqXHR
     * @param status
     * @param errorThrown
     */
    _jQueryAjaxPromiseFail : function(jqXHR, status, errorThrown) {
        
        // Parse the received error to know if its a known OAuth 2.0 error
        var action = this._errorParser.parse(jqXHR);
        
        // If the parse result is not 'undefined' then this is a known OAuth 2.0 error
        if(action !== undefined) {
            
            switch(action) {
                case 'refresh' :
                    this._refreshAccessToken();
                    break;
                case 'reniew' :
                    this._reniewAccessToken();
                    break;
                default:
                    throw new Error('Action \'' + action + '\' is invalid !');
            }

        }
        
    },
    
    /**
     * The overwritten 'Backbone.ajax' method.
     * 
     * @returns a JQuery promise.
     */
    _overwrittenBackboneDotAjax : function() {

        // Try to get an OAuth 2.0 Access Token from the client storage
        var accessToken = this._storageManager.getAccessToken();
    
        // Appends the 'access_token' URL parameter
        if(accessToken) {

            arguments[0].url += arguments[0].url.indexOf('?') === -1 ? '?' : '&';
            arguments[0].url += 'access_token';
            arguments[0].url += '=';
            arguments[0].url += accessToken;
    
        }
        
        var jQueryAjaxPromise = Backbone.$.ajax.apply(Backbone.$, arguments);
        jQueryAjaxPromise.fail(this._jQueryAjaxPromiseFail);

        return jQueryAjaxPromise;
    
    },
    
    /**
     * Function used to refresh the Access Token using the refresh token stored in the associated storage.
     */
    _refreshAccessToken : function() {

        // Try to get an OAuth 2.0 Refresh Token from the client storage
        var refreshToken = this._storageManager.getRefreshToken();
        
        // If a refresh token is stored on the client storage we try to refresh the access token using this refresh 
        // token
        if(refreshToken) {

            $.ajax(
                {
                    url : this._tokenEndpoint, 
                    data : { 'grant_type' : 'refresh_token', 'refresh_token' : refreshToken }, 
                    dataType : 'json',
                    type: 'POST',
                    error : $.proxy(this._reniewAccessToken, this), 
                    success : $.proxy(function(data, textStatus, jqXHR) {

                        // Store the refresed OAuth 2.0 in the local storage
                        // WARNING: Please not that besides the standard OAuth 2.0 Access Token informations the 
                        //          response also contain a 'user_id' field which is specific to the project and 
                        //          contains the technical identifier of the user on the platform
                        this._storageManager.persistRawAccessTokenResponse(JSON.stringify(data));

                        // Reloads the current view
                        // TODO: Très bizarre, il faudrait trouver un moyen de ré-exécuter la requête qui a échoué au 
                        //       début plutôt.
                        // reloadCurrentView();

                }, this)

            });

        }

        // Otherwise we try to reniew the access token
        else {

            this._reniewAccessToken();

        }

    }

};
