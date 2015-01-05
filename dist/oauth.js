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
    
    _refreshAccessToken : function() {
        
        // Try to get an OAuth 2.0 Refresh Token from the client storage
        var refreshToken = this._accessTokenResponseStorage.getRefreshToken();
        
        // If a refresh token is stored on the client storage we try to refresh the access token using this refresh 
        // token
        if(refreshToken) {

            $.ajax(
                {
                url : this._tokenEndpoint, 
                data : { 'grant_type' : 'refresh_token', 'refresh_token' : refreshToken }, 
                dataType : 'json',
                type: 'POST',
                error : $.proxy(this._reniewOAuth2AccessToken, this), 
                success : function(data, textStatus, jqXHR) {

                    // Store the refresed OAuth 2.0 in the local storage
                    // WARNING: Please not that besides the standard OAuth 2.0 Access Token informations the response 
                    //          also contain a 'user_id' field which is specific to the project and contains the 
                    //          technical identifier of the user on the platform 
                    localStorage.setItem('mygoodmoment.oauth2.accessTokenResponse', JSON.stringify(data));

                    // Reloads the current view
                    reloadCurrentView();

                }

            });

        } 
        
        // Otherwise we try to reniew the access token
        else {

            this._reniewAccessToken();

        }
        
    },
                          
    _onJQueryAjaxPromiseFail : function(jqXHR, status, errorThrown) {
        
        // If we are on a 401 HTTP error response (i.e Unauthorized)
        if(jqXHR.status === 401) {

            // Checks if the returned response is a JSON one and is a valid API Problem response
            if(jqXHR.responseJSON !== null && typeof jqXHR.responseJSON !== 'undefined') {

                // If their is a 'title' attached to the response this is an API Problem with a potential 
                // OAuth 2.0 error code
                if(jqXHR.responseJSON.title !== null && typeof jqXHR.responseJSON.title !== 'undefined') {
                
                    // The OAuth 2.0 Access Token which was send with the request is invalid, the 401 Status 
                    // code with the error code 'invalid_token' can express multiple errors : 
                    //  - The provided Access Token does not exist on server side (can be an error from the 
                    //    client or a clear on server side)
                    //  - The provided Access Token has expired
                    if(jqXHR.responseJSON.title === 'invalid_token') {

                        // The OAuth 2.0 Access Token is invalid, in this case we try to reniew the Access 
                        // Token without a Refresh Token. That's to say by providing the user credentials 
                        // and potentially open a new Login Dialog
                        if(jqXHR.responseJSON.errorCode === 'token_invalid') {

                            // Try to login again and reload the last opened page if a login is successful
                            reniewOAuth2AccessToken();

                        } 
                        
                        // The OAuth 2.0 Access Token has expired, in this case we first try to refresh the 
                        // Access Token using the 'refresh_token'
                        else if(jqXHR.responseJSON.errorCode === 'token_expired') {

                            // Try to refresh the OAuth 2.0 Access Token, if not possible reniew it
                            refreshAccessToken();

                        } 
                        
                        // The OAuth 2.0 Access Token is Malformed (missing "expires" or "client_id"), this 
                        // error should never appear and has to be considered a client coding error.
                        else if(jqXHR.responseJSON.errorCode === 'token_malformed') {

                            // Try to login again and reload the last opened page if a login is successful
                            reniewOAuth2AccessToken();

                        }
                        
                        // Unknown invalid token error, this should never appear !!!
                        else {

                            // TODO: Envoi de l'erreur vers Sentry !
                            console.log('Invalid token !');
                            console.log(jqXHR.responseJSON);

                        }

                    }
                     
                }
             
            }
            
        } 

        // Error not manageable
        else {

            // TODO: Erreur inconnue, pas sûr on a encore des codes d'erreurs connus ?
            console.log('Error !');
            console.log(JSON.stringify(jqXHR));
            console.log(errorThrown);

        }
        
    },
    
    _overwrittenBackboneDotAjax : function() {
        
        // Try to get an OAuth 2.0 Access Token from the client storage
        var accessToken = this._accessTokenResponseStorage.getAccessToken();

        // Appends the 'access_token' URL parameter
        if(accessToken) {
            
            arguments[0].url += arguments[0].url.indexOf('?') === -1 ? '?' : '&';
            arguments[0].url += 'access_token';
            arguments[0].url += accessToken;

        }
        
        var jQueryAjaxPromise = Backbone.$.ajax.apply(Backbone.$, arguments);
        jQueryAjaxPromise.fail(this._jQueryAjaxPromiseFail);

        return jQueryAjaxPromise;

    },
    
    /**
     * Function used to overwrite the `Backbone.ajax` method. After overwritting all calls to `Backbone.ajax` will 
     * automatically manage OAuth 2.0 tokens to call your secured web services.
     */
    overwriteBackboneDotAjax : function() {
        
        // The default implementationof `Backbone.ajax` has not been backuped
        if(!this._backupedBackboneDotAjax) {
            
            this._backupedBackboneDotAjax = Backbone.ajax;
            
        }

    }
                          
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
    
    }

};
