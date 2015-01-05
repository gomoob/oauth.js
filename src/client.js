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