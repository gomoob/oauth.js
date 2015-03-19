/**
 * Class used to represent an Error OAuth 2.0 Access Token response.
 * 
 * If the request failed client authentication or is invalid, the authorization server returns an error response as 
 * described in [Section 5.2](https://tools.ietf.org/html/rfc6749#section-5.2 "Section 5.2").
 * 
 * @author Baptiste GAILLARD (baptiste.gaillard@gomoob.com)
 * @see https://tools.ietf.org/html/rfc6749#section-5.2
 */
OAuth.AccessToken.ErrorResponse = function() {
    
    // The SuccessfulResponse extends the AbstractResponse
    OAuth.AccessToken.AbstractResponse.apply(this, arguments);
    
    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    // PRIVATE MEMBERS
    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    /**
     * The OAuth 2.0 error code associated to this error response.
     * 
     * The OAuth.JS library defines 3 types of error codes : 
     *  * Standard   : Standard error codes are error codes defined by the OAuth 2.0 RFC in 
     *                 [Section 5.2](https://tools.ietf.org/html/rfc6749#section-5.2 "Section 5.2").
     *  * Extension  : Extension error codes are additional error codes your application could defined or a registered 
     *                 OAuth 2.0 extension could define. Those error codes are described by the OAuth 2.0 RFC in 
     *                 [Section 8.5](https://tools.ietf.org/html/rfc6749#section-8.5 "Section 8.5").
     *  * Critical   : Critial error codes ARE NOT DEFINED by the OAuth 2.0 RFC and are used by OAuth.JS when the server 
     *                 returned invalid responses (i.e which are not compliant with the OAuth 2.0 RFC). Critical errors 
     *                 have error codes which are compliant with the following template : '__oauth_js__${errorCode}__'.
     * 
     * @instance
     * @private
     * @type {String}
     */
    var _error = '__oauth_js__uninitialized__';
    
    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    // PUBLIC MEMBERS
    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    /**
     * Gets the error code associated to this error response, the OAuth.JS library defines 3 types of error codes : 
     *  * Standard   : Standard error codes are error codes defined by the OAuth 2.0 RFC in 
     *                 [Section 5.2](https://tools.ietf.org/html/rfc6749#section-5.2 "Section 5.2").
     *  * Extension  : Extension error codes are additional error codes your application could defined or a registered 
     *                 OAuth 2.0 extension could define. Those error codes are described by the OAuth 2.0 RFC in 
     *                 [Section 8.5](https://tools.ietf.org/html/rfc6749#section-8.5 "Section 8.5").
     *  * Critical   : Critial error codes ARE NOT DEFINED by the OAuth 2.0 RFC and are used by OAuth.JS when the server 
     *                 returned invalid responses (i.e which are not compliant with the OAuth 2.0 RFC). Critical errors 
     *                 have error codes which are compliant with the following template : '__oauth_js__${errorCode}__'.
     *                 
     * @return {String} The error code associated to this error response.
     */
    this.getError = function() {

        return _error;

    };
    
    /**
     * Function used to indicate if this error corresponds to a critial error, Critial error codes ARE NOT DEFINED by 
     * the OAuth 2.0 RFC and are used by OAuth.JS when the server returned invalid responses (i.e which are not 
     * compliant with the OAuth 2.0 RFC). Critical errors have error codes which are compliant with the following 
     * template : '__oauth_js__${errorCode}__'.
     * 
     * @return {Boolean} True if this error corresponds to a critical error, false otherwise.
     */
    this.isCriticalError = function() {

        return OAuth.AccessToken.ErrorResponse.isCriticalErrorCode(_error);

    };
    
    /**
     * Function used to indicate if this error corresponds to an extension OAuth 2.0 error. Extension error codes are 
     * additional error codes your application could defined or a registered OAuth 2.0 extension could define. Those 
     * error codes are described by the OAuth 2.0 RFC in 
     * [Section 8.5](https://tools.ietf.org/html/rfc6749#section-8.5 "Section 8.5").
     * 
     * @return {Boolean} True if this error corresponds to an extension OAuth 2.0 error, false otherwise.
     */
    this.isExtensionError = function() {
        
        return !this.isStandardError() && !this.isCriticalError();

    }; 
    
    /**
     * Function used to indicate if this error corresponds to a standard OAuth 2.0 error. Standard error codes are error 
     * codes defined by the OAuth 2.0 RFC in 
     * [Section 5.2](https://tools.ietf.org/html/rfc6749#section-5.2 "Section 5.2").
     * 
     * @return {Boolean} True if this error corresponds to a standard OAuth 2.0 error, false otherwise.
     */
    this.isStandardError = function() {
        
        return OAuth.AccessToken.ErrorResponse.standardErrorCodes.indexOf(_error) !== -1;

    };
    
    /**
     * Indicates if this response represents an OAuth 2.0 Access Token Error response.
     * 
     * @return {Boolean} True if this response represents an OAuth 2.0 Access Token Error response, false otherwise.
     * @see https://tools.ietf.org/html/rfc6749#section-5.2
     */
    this.isError = function() {
        
        return true;
        
    };
    
    /**
     * Indicates if this response represents an OAuth 2.0 Access Token Successful response.
     * 
     * @return {Boolean} True if this response represents an OAuth 2.0 Access Token Successful response, false 
     *         otherwise.
     * @see https://tools.ietf.org/html/rfc6749#section-5.1
     */
    this.isSuccessful = function() {
        
        return false;
        
    };
    
    /**
     * Sets the error code associated to this error response, the OAuth.JS library defines 3 types of error codes : 
     *  * Standard   : Standard error codes are error codes defined by the OAuth 2.0 RFC in 
     *                 [Section 5.2](https://tools.ietf.org/html/rfc6749#section-5.2 "Section 5.2").
     *  * Extension  : Extension error codes are additional error codes your application could defined or a registered 
     *                 OAuth 2.0 extension could define. Those error codes are described by the OAuth 2.0 RFC in 
     *                 [Section 8.5](https://tools.ietf.org/html/rfc6749#section-8.5 "Section 8.5").
     *  * Critical   : Critial error codes ARE NOT DEFINED by the OAuth 2.0 RFC and are used by OAuth.JS when the server 
     *                 returned invalid responses (i.e which are not compliant with the OAuth 2.0 RFC). Critical errors 
     *                 have error codes which are compliant with the following template : '__oauth_js__${errorCode}__'.
     *                 
     * @param {String} error The error code to associated to this error response.
     */
    this.setError = function(error) {
        
        _error = error;
        
    };
    
    /**
     * Function used to create a JSON representation of this Error OAuth 2.0 Access Token response. This JSON 
     * representation can then be used to persist this Error OAuth 2.0 Access Token response on a storage.
     * 
     * @return {Object} A javascript object which represents a JSON representation of this  Error OAuth 2.0 Access Token 
     *         response.
     */
    this.toJSON = function() {

        return {
            error : _error,
            jsonResponse : this.getJsonResponse(),
            xhr : this.getXhr() ? OAuth.XhrUtils.toJSON(this.getXhr()) : null
        };

    };
    
};

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// STATIC MEMBERS
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

/**
 * An array which stores valid OAuth 2.0 Error Access Token response error codes. Standard error codes are error 
 * codes defined by the OAuth 2.0 RFC in 
 * [Section 5.2](https://tools.ietf.org/html/rfc6749#section-5.2 "Section 5.2").
 * 
 * @instance
 * @private
 * @type {String[]}
 * @see https://tools.ietf.org/html/rfc6749#section-5.2 "Section 5.2"
 */
OAuth.AccessToken.ErrorResponse.standardErrorCodes = [
    
    // The request is missing a required parameter, includes an unsupported parameter value (other than grant type),
    // repeats a parameter, includes multiple credentials, utilizes more than one mechanism for authenticating the
    // client, or is otherwise malformed.
    'invalid_request',
    
    // Client authentication failed (e.g., unknown client, no client authentication included, or unsupported 
    // authentication method).  The authorization server MAY return an HTTP 401 (Unauthorized) status code to 
    // indicate which HTTP authentication schemes are supported. If the client attempted to authenticate via the 
    // "Authorization" request header field, the authorization server MUST respond with an HTTP 401 (Unauthorized) 
    // status code and include the "WWW-Authenticate" response header field matching the authentication scheme used 
    // by the client.
    'invalid_client',
    
    // The provided authorization grant (e.g., authorization code, resource owner credentials) or refresh token is
    // invalid, expired, revoked, does not match the redirection URI used in the authorization request, or was 
    // issued to another client.
    'invalid_grant',
    
    // The authenticated client is not authorized to use this authorization grant type.
    'unauthorized_client',
    
    // The authorization grant type is not supported by the authorization server.
    'unsupported_grant_type',
    
    // The requested scope is invalid, unknown, malformed, or exceeds the scope granted by the resource owner.
    'invalid_scope'
];

// TODO: A documenter et tester...
// TODO: Créer 2 autres méthodes isStandardErrorCode() et isExtensionErrorCode()
OAuth.AccessToken.ErrorResponse.isCriticalErrorCode = function(errorCode) {

    return /^__oauth_js__[\w\d-_]+__$/.test(errorCode);
    
};

/**
 * Function used to indicate if a JSON response corresponds to a valid OAuth 2.0 Access Token Error response. A JSON 
 * response corresponds to a valid OAuth 2.0 Access Token Error response if : 
 *  * It is a valid JSON object
 *  * It has an 'error' property
 *  * Its 'error' property is a string
 *  * Its 'error' property string does not include characters outside the set %x20-21 / %x23-5B / %x5D-7E
 *  
 * @param {Object | Array} jsonResponse An array or object which represents a JSON response returned from a server.
 *  
 * @return {Boolean} True if the JSON object corresponds to a valid OAuth 2.0 Access Token Error response, false 
 *         otherwise.
 */
OAuth.AccessToken.ErrorResponse.isJsonResponseValid = function(jsonResponse) {

    // The response MUST BE a JSON object
    var valid = typeof jsonResponse === 'object';
    
    // The response MUST HAVE an 'error' parameter
    valid = valid && jsonResponse.hasOwnProperty('error');
    
    // The 'error' parameter MUST BE a string
    valid = valid && typeof jsonResponse.error === 'string';
    
    // As described in [Section 5.2](https://tools.ietf.org/html/rfc6749#section-5.2 "Section 5.2") of the OAuth 2.0 
    // specifications Values for the "error" parameter MUST NOT include characters outside the set 
    // %x20-21 / %x23-5B / %x5D-7E.
    // @see http://www.unicode.org/charts/PDF/U0000.pdf
    valid = valid && /^[\x20-\x21\x23-\x5B\x5D-\x7E]+$/.test(jsonResponse.error);

    return valid;

};