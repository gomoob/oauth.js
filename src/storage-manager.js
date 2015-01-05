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