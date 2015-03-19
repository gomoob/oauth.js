/**
 * Class used to represent an OAuth 2.0 Access Token response.
 * 
 * If the access token request is valid and authorized, the authorization server issues an access token and optional 
 * refresh token as described in [Section 5.1](https://tools.ietf.org/html/rfc6749#section-5.1 "Section 5.1").  If the 
 * request failed client authentication or is invalid, the authorization server returns an error response as described 
 * in [Section 5.2](https://tools.ietf.org/html/rfc6749#section-5.2 "Section 5.2").
 * 
 * @author Baptiste GAILLARD (baptiste.gaillard@gomoob.com)
 */
OAuth.AccessToken.AbstractResponse = function() {

    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    // PRIVATE MEMBERS
    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    /**
     * An object or array which represents the JSON response returned from the server. This attribute can null when the 
     * server returned a response which did not represent a valid JSON type or if an error is encountered in the 
     * response headers. This attribute can also be null when OAuth.JS tried to create an Access Token Response from a 
     * corrupted storage (in this case the response is a critical one with a code equals to 
     * '__oauth_js__storage_corrupted__')
     * 
     * If you server implementation is bad this value can also be an array (because your server returned a valid JSON 
     * array, in this case the response is a critical one with a code equals to '__oauth_js__entity_body_not_json__'). 
     * If your server returned a JSON object which is not compliant with the OAuth 2.0 specification this attribute is 
     * set with this bad object (in this case the response is a critical one with a code equals to 
     * '__oauth_js__entity_body_invalid_json__'). 
     * 
     * @instance
     * @private
     * @type {Object | Array}
     */
    var _jsonResponse = null;
    
    /**
     * The XMLHttpRequest object which was used to send a request on server side and which led to the creation of this 
     * OAuth 2.0 Access Token response.
     * 
     * When the Access Token Response is built from a string / JSON representation retrieved from a storage this 
     * attribute is a "fake" {@link XMLHttpRequest} object. This is because it is normally not possible to re-build an 
     * {@link XMLHttpRequest} object having a specific state from scratch.
     * 
     * This attribute can be null when OAuth.JS tried to create an Access Token Response from a corrupted storage (in 
     * this case the response is a critical one with a code equals to '__oauth_js__storage_corrupted__').
     * 
     * @instance
     * @private
     * @type {XHMLHttpRequest}
     */
    var _xhr = null;
    
    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    // PUBLIC MEMBERS
    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    
    /**
     * Gets an object or array which represents the JSON response returned from the server. This attribute can null when 
     * the server returned a response which did not represent a valid JSON type or if an error is encountered in the 
     * response headers. This attribute can also be null when OAuth.JS tried to create an Access Token Response from a 
     * corrupted storage (in this case the response is a critical one with a code equals to 
     * '__oauth_js__storage_corrupted__')
     * 
     * If you server implementation is bad this value can also be an array (because your server returned a valid JSON 
     * array, in this case the response is a critical one with a code equals to '__oauth_js__entity_body_not_json__'). 
     * If your server returned a JSON object which is not compliant with the OAuth 2.0 specification this attribute is 
     * set with this bad object (in this case the response is a critical one with a code equals to 
     * '__oauth_js__entity_body_invalid_json__'). 
     * 
     * @return {Object | Array} The JSON response returned by the server.
     */
    this.getJsonResponse = function() {
        
        return _jsonResponse;
        
    };
    
    /**
     * Gets the XMLHttpRequest object which was used to send a request on server side and which led to the creation of 
     * this OAuth 2.0 Access Token response.
     * 
     * When the Access Token Response is built from a string / JSON representation retrieved from a storage this 
     * attribute is a "fake" {@link XMLHttpRequest} object. This is because it is normally not possible to re-build an 
     * {@link XMLHttpRequest} object having a specific state from scratch.
     * 
     * This attribute can be null when OAuth.JS tried to create an Access Token Response from a corrupted storage (in 
     * this case the response is a critical one with a code equals to '__oauth_js__storage_corrupted__').
     * 
     * @return {XHMLHttpRequest} The XMLHttpRequest object which was used to send a request on server side and which led 
     *         to the creation of this OAuth 2.0 Access Token response.
     */
    this.getXhr = function() {
        
        return _xhr;
        
    };
    
    /**
     * Sets an object or array which represents the JSON response returned from the server. This attribute can null when 
     * the server returned a response which did not represent a valid JSON type or if an error is encountered in the 
     * response headers. This attribute can also be null when OAuth.JS tried to create an Access Token Response from a 
     * corrupted storage (in this case the response is a critical one with a code equals to 
     * '__oauth_js__storage_corrupted__').
     * 
     * If you server implementation is bad this value can also be an array (because your server returned a valid JSON 
     * array, in this case the response is a critical one with a code equals to '__oauth_js__entity_body_not_json__'). 
     * If your server returned a JSON object which is not compliant with the OAuth 2.0 specification this attribute is 
     * set with this bad object (in this case the response is a critical one with a code equals to 
     * '__oauth_js__entity_body_invalid_json__'). 
     * 
     * @return {Object | Array} jsonResponse The JSON response returned by the server.
     */
    this.setJsonResponse = function(jsonResponse) {
        
        _jsonResponse = jsonResponse;
        
    };
    
    /**
     * Sets the XMLHttpRequest object which was used to send a request on server side and which led to the creation of 
     * this OAuth 2.0 Access Token response.
     * 
     * When the Access Token Response is built from a string / JSON representation retrieved from a storage this 
     * attribute is a "fake" {@link XMLHttpRequest} object. This is because it is normally not possible to re-build an 
     * {@link XMLHttpRequest} object having a specific state from scratch.
     * 
     * This attribute can be null when OAuth.JS tried to create an Access Token Response from a corrupted storage (in 
     * this case the response is a critical one with a code equals to '__oauth_js__storage_corrupted__').
     * 
     * @param {XHMLHttpRequest} xhr The XMLHttpRequest object which was used to send a request on server side and which 
     *        led to the creation of this OAuth 2.0 Access Token response.
     */
    this.setXhr = function(xhr) {
        
        _xhr = xhr;
        
    };
    
};

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//STATIC MEMBERS
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

/**
 * Function used to create an OAuth 2.0 Access Token Response object using a JSON representation.
 * 
 * @param {Object} jsonObject A JSON representation used to create a {@link OAuth.AccessToken.ErrorResponse} or 
 *        {@link OAuth.AccessToken.SuccessfulResponse} object.
 * 
 * @return {OAuth.AccessToken.ErrorResponse | OAuth.AccessToken.SuccessfulResponse} The resulting Access Token Response 
 *         object.
 * @throws Error If the provided JSON does not represents a valid Access Token Response object.
 */
OAuth.AccessToken.AbstractResponse.createFromJson = function(jsonObject) {

    // The JSON object must be valid
    if(!OAuth.AccessToken.AbstractResponse.isJsonValid(jsonObject)) {
        
        throw new Error('The provided JSON object does not correspond to a valid Access Token Response !');

    }
    
    var accessTokenResponse = null;
    
    // The JSON object represents an Error Access Token Response
    if(typeof jsonObject.jsonResponse.error === 'string') {
        
        // Critical error
        if(OAuth.AccessToken.ErrorResponse.isCriticalErrorCode(jsonObject.jsonResponse.error )) {
            
            accessTokenResponse = new OAuth.AccessToken.CriticalErrorResponse();
        
        }
        
        // Standard error
        else {
            
            accessTokenResponse = new OAuth.AccessToken.ErrorResponse();
            
        }
        
        accessTokenResponse.setError(jsonObject.jsonResponse.error );
        
    } 
    
    // The JSON object represents a Successful Access Token Response
    else {
        
        accessTokenResponse = new OAuth.AccessToken.SuccessfulResponse();
        
    }
    
    // Sets the 'jsonResponse'
    accessTokenResponse.setJsonResponse(jsonObject.jsonResponse);

    // Sets a "fake" XMLHttpRequest object, here the XMLHttpRequest is "fake" because it is normally not possible to 
    // re-build an {@link XMLHttpRequest} object having a specific state from scratch.
    accessTokenResponse.setXhr(OAuth.XhrUtils.fromJSON(jsonObject.xhr));
    
    return accessTokenResponse;

};

/**
 * Function used to check if a JSON object corresponds to a valid Access Token Response JSON representation. A JSON 
 * representation of an Access Token Response to keep a description of the last OAuth 2.0 Access Token Response built 
 * from the last server request. This function validates the objects which are produced by the 
 * {@link OAuth.AccessToken.ErrorResponse#toJSON()} and {@link OAuth.AccessToken.SuccessfulResponse#toJSON()} functions.
 * 
 * @param {Object} jsonObject The JSON representation to validate.
 * 
 * @return {Boolean} True if the provided JSON representation is valid representation of an 
 *         {@link OAuth.AccessToken.ErrorResponse} or {@link OAuth.AccessToken.SuccessfulResponse} object, false 
 *         otherwise.
 */
OAuth.AccessToken.AbstractResponse.isJsonValid = function(jsonObject) {

    // The parameter MUST BE an object
    var valid = typeof jsonObject === 'object';
    
    // Validates the 'jsonResponse' object property
    if(typeof jsonObject.jsonResponse === 'object' && 
       typeof jsonObject.jsonResponse.error === 'string') {
        
        valid = valid && OAuth.AccessToken.ErrorResponse.isJsonResponseValid(jsonObject.jsonResponse);
        
    } else {
        
        valid = valid && OAuth.AccessToken.SuccessfulResponse.isJsonResponseValid(jsonObject.jsonResponse);
        
    }
    
    // Validates the 'xhr' object property
    valid = valid && OAuth.AccessToken.AbstractResponse.isJsonXhrValid(jsonObject.xhr);

    return valid;

};

/**
 * Function used to check if a JSON object corresponds to a valid {@link XMLHttpRequest} JSON representation. A JSON 
 * representation of the {@link XMLHttpRequest} is used by OAuth.JS to keep a description of the last request sent to 
 * the server.
 * 
 * @param {Object} jsonXhr The {@link XMLHttpRequest} JSON representation to validate.
 * 
 * @return {Boolean} True if the provided {@link XMLHttpRequest} JSON representation is valid, false otherwise.
 */
OAuth.AccessToken.AbstractResponse.isJsonXhrValid = function(jsonXhr) {

    // The parameter MUST BE an object
    var valid = typeof jsonXhr === 'object';

    // The object MUST HAVE a 'readyState' number property
    // @see http://www.w3.org/TR/XMLHttpRequest/#interface-xmlhttprequest
    // @see http://www.w3.org/TR/XMLHttpRequest/#states
    valid = valid && typeof jsonXhr.readyState === 'number';
    
    // The object MUST HAVE a 'status' number property
    // @see http://www.w3.org/TR/XMLHttpRequest/#the-status-attribute
    valid = valid && typeof jsonXhr.status === 'number';
    
    // The object MUST HAVE a 'statusText' string property
    // @see http://www.w3.org/TR/XMLHttpRequest/#the-statustext-attribute
    valid = valid && typeof jsonXhr.statusText === 'string';
    
    // The object MUST HAVE a 'response' string property
    // @see http://www.w3.org/TR/XMLHttpRequest/#the-response-attribute
    // FIXME: This is a "complexe" property and it is not already validated
    
    // The object MUST HAVE a 'responseText' string property
    // @see http://www.w3.org/TR/XMLHttpRequest/#the-responsetext-attribute
    valid = valid && typeof jsonXhr.responseText === 'string';
    
    // The object MUST HAVE a 'responseXML' string property
    // @see http://www.w3.org/TR/XMLHttpRequest/#the-responsexml-attribute
    valid = valid && (jsonXhr.responseXML === null || typeof jsonXhr.responseXML === 'string');
    
    return valid;

};