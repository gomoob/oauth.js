/**
 * Class which represents an Authentication Status, an authentication status describes the authentication state of the 
 * user using an app.
 * 
 * @author Baptiste GAILLARD (baptiste.gaillard@gomoob.com)
 * @class AuthStatus
 * @memberof OAuth
 */
OAuth.AuthStatus = function(settings) {

    // TODO: Il faut maintenant que le storage manager persiste un AuthStatus

    /**
     * The Access Token Response object which was used to created this AuthStatus object. In most cases this Access 
     * Token Response object is only useful by the developer to inspect error responses. Successful responses are useful 
     * internally but the developer can only call the {@link #isConnected()} function.
     * 
     * @instance
     * @private
     * @type {OAuth.AccessToken.Response}
     */
    var _accessTokenResponse = null;

    /**
     * The status of the current user connection, this status can only be equal to 2 values : 
     *  * `connected`    : The user is currently connected (here "currently" means in fact it was connected the last 
     *                     time this AuthStatus was created or refreshed / updated).
     *  * `disconnected` : The user is currently disconnected.
     *  
     * @instance
     * @private
     * @type {String}
     */
    var _status = 'disconnected';
    
    // TODO: A documenter, je pense qu'on peut faire que cette fonction retourne toujours quelque chose même si le 
    //       status n'est pas créé suite à une requête sur le Token Endpoint. Dans ce cas indiquer dans la 
    //       docummentation des Access Token Response que le champs 'xhr' est "fictif" si la réponse est construite 
    //       depuis un storage...   
    /**
     * Gets the Access Token Response object which was used to create this AuthStatus object. In most cases this Access 
     * Token Response object is only useful by the developer to inspect error responses. Successful responses are useful 
     * internally but the developer can only call the {@link #isConnected()} function.
     * 
     * @return {OAuth.AccessToken.Response} The Access Token Response object which as used to create this OAuthStatus 
     *         object.
     */
    this.getAccessTokenResponse = function() {

        return _accessTokenResponse;

    };

    /**
     * Function used to indicate if the user is currently connected (here "currently" means in fact it was connected the 
     * last time this AuthStatus was created or refreshed / updated). 
     * 
     * If this function returns true then the {@link #getAccessTokenResponse()} function will always return an 
     * {@link OAuth.AccessToken.SuccessfulResponse} object.
     * 
     * @return {Boolean} True if the user is currently connected, false otherwise.
     */
    this.isConnected = function() {

        return _status === 'connected';

    };
    
    /**
     * Function used to indicate if the user is currently disconnected (here "currently" means in fact it was 
     * disonnected the last time this AuthStatus was created or refreshed / updated).
     * 
     * If this function returns true then the {@link #getAccessTokenResponse()} function will always return an 
     * {@link OAuth.AccessToken.ErrorResponse} object.
     * 
     * @return {Boolean} True if the user is currently disconnected, false otherwise.
     */
    this.isDisconnected = function() {

        return _status === 'disconnected';

    };

    /**
     * Function used to create a JSON representation of this {@link AuthStatus}. This JSON representation can then be 
     * used to persist this {@link AuthStatus} on a storage.
     * 
     * @return {Object} A javascript object which represents a JSON representation of this {@link AuthStatus}.
     */
    this.toJSON = function() {
        
        return {
            status : _status,
            accessTokenResponse : _accessTokenResponse.toJSON()
        };

    };
    
    /**
     * Function used to create a string representation of this {@link AuthStatus}. This string representation can then 
     * be used to persist this {@link AuthStatus} on a storage.
     * 
     * @return {String} A string representation of this {@link AuthStatus}.
     */
    this.toString = function() {
        
        return JSON.stringify(this.toJSON());
        
    };
    
    // The settings object is mandatory
    if(typeof settings !== 'object') {
     
        throw new Error('This object must be initialized with a settings object !');
        
    }
    
    // A valid status is mandatory
    if(settings.status !== 'connected' && settings.status !== 'disconnected') {
        
        throw new Error('The settings object has no status property or an invalid status property !');
        
    }
    
    // A valid access token response object is mandatory
    if(typeof settings.accessTokenResponse !== 'object') {
        
        throw new Error(
            'The settings object has not access token response object or an invalid access token response object !'
        );

    }
    
    _status = settings.status;
    _accessTokenResponse = settings.accessTokenResponse;

};