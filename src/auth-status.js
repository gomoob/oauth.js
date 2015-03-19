/**
 * Class which represents an Authentication Status, an authentication status describes the authentication state of the 
 * user using an app.
 * 
 * @author Baptiste GAILLARD (baptiste.gaillard@gomoob.com)
 * @class AuthStatus
 * @memberof OAuth
 */
OAuth.AuthStatus = function(settings) {
    
    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    // PRIVATE MEMBERS
    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    
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
    
    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    // PUBLIC MEMBERS
    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    /**
     * Gets the Access Token Response object which was used to create this AuthStatus object. In most cases this Access 
     * Token Response object is only useful by the developer to inspect error responses. Successful responses are useful 
     * internally but the developer can only call the {@link #isConnected()} function.
     * 
     * The Access Token Response can be null when the user is disconnected and the disconnection operation was a manual 
     * disconnection (i.e not an automatic disconnection following an error).
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
            accessTokenResponse : _accessTokenResponse ? _accessTokenResponse.toJSON() : null
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
    
    // If no access token response is provided than the status MUST BE equal to 'disconnected'
    if(!settings.accessTokenResponse && settings.status !== 'disconnected') {
        
        throw new Error('An AuthStatus without an access token response must always be disconnected !');
        
    }

    // If an access token response is provided it must be an object
    else if(settings.accessTokenResponse && typeof settings.accessTokenResponse !== 'object') {
        
        throw new Error(
            'The settings object has an invalid access token response object !'
        );

    }
    
    _status = settings.status;
    _accessTokenResponse = settings.accessTokenResponse ? settings.accessTokenResponse : null;

};

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//STATIC MEMBERS
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

/**
 * Function used to create an {@link OAuth.AuthStatus} object which indicate that the content of the storage has been 
 * corrupted. A storage content is corrupted when a malicious user manually update its content. 
 * 
 * @return {OAuth.AuthStatus} An {@link OAuth.AuthStatus} object which indicate that the content of the storage has been 
 *         corrupted.
 */
OAuth.AuthStatus.createCorrupted = function() {
    
    var accessTokenResponse = null, 
        authStatus = null;
    
    accessTokenResponse = new OAuth.AccessToken.CriticalErrorResponse();
    accessTokenResponse.setError('__oauth_js__storage_corrupted__');
    authStatus = new OAuth.AuthStatus(
        {
            status : 'disconnected',
            accessTokenResponse : accessTokenResponse
        }
    );
    
    return authStatus;
    
};

/**
 * Function used to create an {@link OAuth.AuthStatus} object from a JSON string representation. In most cases this 
 * function is used to create an {@link OAuth.AuthStatus} javascript object from data pulled from a specific storage 
 * mechanism. 
 * 
 * @param {String} string The string to convert into an {@link OAuth.AuthStatus} object.
 * 
 * @return {OAuth.AuthStatus} The created {@link OAuth.AuthStatus} object.
 */
OAuth.AuthStatus.createFromString = function(string) {

    var authStatus = null;
    
    // The provided parameter must be a string
    if(typeof string !== 'string') {

        authStatus = OAuth.AuthStatus.createCorrupted();
        
    } 

    // The provided parameter is a string, convert it to a JSON representation and validates this representation
    else {

        // The provided parameter must be a valid JSON object
        var authStatusJson = null; 
    
        try {
            authStatusJson = JSON.parse(string);
            
            // The AuthStatus JSON representation is valid
            if(OAuth.AuthStatus.isJsonValid(authStatusJson)) {
                
                authStatus = new OAuth.AuthStatus(
                    {
                        status : authStatusJson.status, 
                        accessTokenResponse : OAuth.AccessToken.AbstractResponse.createFromJson(
                            authStatusJson.accessTokenResponse
                        )
                    }
                );
                
            }

            // The AuthStatus JSON representation is invalid
            else {
                
                authStatus = OAuth.AuthStatus.createCorrupted();

            }
            
        } catch(syntaxError) {
            
            authStatus = OAuth.AuthStatus.createCorrupted();

        }
    }

    return authStatus;

};

/**
 * Function used to check if a JSON object corresponds to a valid {@link OAuth.AuthStatus} JSON representation. The 
 * purpose of this function is to validate what would be returned by the {@link OAuth.AuthStatus#toJSON()} method.
 * 
 * @param {Object} jsonObject The JSON representation to validate.
 * 
 * @return {Boolean} True if the provided JSON representation is a valid representation of an {@link OAuth.AuthStatus} 
 *         object, false otherwise.
 */
OAuth.AuthStatus.isJsonValid = function(jsonObject) {
    
    // The parameter MUST BE a JSON object
    var valid = OAuth.ObjectUtils.isObject(jsonObject);
    
    // The 'status' parameter MUST BE equal to 'connected' or 'disconnected'
    valid = valid && (jsonObject.status === 'connected' || jsonObject.status === 'disconnected');
    
    // If the 'accessTokenResponse' is provided and not null it MUST BE valid
    if(jsonObject.accessTokenResponse !== null) {

        valid = valid && OAuth.AccessToken.AbstractResponse.isJsonValid(jsonObject.accessTokenResponse);

    }
    
    return valid;
    
};