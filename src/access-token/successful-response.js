/**
 * Class used to represent a Successful OAuth 2.0 Access Token response.
 * 
 * If the access token request is valid and authorized, the authorization server issues an access token and optional 
 * refresh token as described in [Section 5.1](https://tools.ietf.org/html/rfc6749#section-5.1 "Section 5.1").
 * 
 * @author Baptiste GAILLARD (baptiste.gaillard@gomoob.com)
 * @see https://tools.ietf.org/html/rfc6749#section-5.1
 */
OAuth.AccessToken.SuccessfulResponse = function() {
    
    // The SuccessfulResponse extends the AbstractResponse
    OAuth.AccessToken.AbstractResponse.apply(this, arguments);
    
    /**
     * Indicates if this response represents an OAuth 2.0 Access Token Error response.
     * 
     * @return {Boolean} True if this response represents an OAuth 2.0 Access Token Error response, false otherwise.
     * @see https://tools.ietf.org/html/rfc6749#section-5.2
     */
    this.isError = function() {
        
        return false;
        
    };
    
    /**
     * Indicates if this response represents an OAuth 2.0 Access Token Successful response.
     * 
     * @return {Boolean} True if this response represents an OAuth 2.0 Access Token Successful response, false 
     *         otherwise.
     * @see https://tools.ietf.org/html/rfc6749#section-5.1
     */
    this.isSuccessful = function() {
        
        return true;
        
    };
    
    /**
     * Function used to create a JSON representation of this Successful OAuth 2.0 Access Token response. This JSON 
     * representation can then be used to persist this Successful OAuth 2.0 Access Token response on a storage.
     * 
     * @return {Object} A javascript object which represents a JSON representation of this Successful OAuth 2.0 Access 
     *         Token response.
     */
    this.toJSON = function() {

        return {
            jsonResponse : this.getJsonResponse(),
            xhr : OAuth.XhrUtils.toJSON(this.getXhr())
        };

    };

};

/**
 * Function used to indicate if a JSON response corresponds to a valid OAuth 2.0 Access Token Successful response. A 
 * JSON response corresponds to a valid OAuth 2.0 Access Token Successful response if : 
 *  * It is a valid JSON object
 *  * It has an 'access_token' property
 *  * The 'access_token' property must be compliant with 
 *    [Section A.12](https://tools.ietf.org/html/rfc6749#appendix-A.12 "\"access_token\" Syntax")
 *  * It has a 'token_type' property
 *  * The 'token_type' property must be compliant with 
 *    [Section A.13](https://tools.ietf.org/html/rfc6749#appendix-A.13 "\"token_type\" Syntax")
 *  * If their is an 'expires_in' property then this property must be compliant with 
 *    [Section A.14](https://tools.ietf.org/html/rfc6749#appendix-A.14) "\"expires_in\" Syntax")
 *  * If their is a 'refresh_token' property then this property must be compliant with 
 *    [Section A.17](https://tools.ietf.org/html/rfc6749#appendix-A.17 "\"refresh_token\" Syntax")
 *  * If their is a 'scope' property then this property must be compliant with 
 *    [Section 1.4](https://tools.ietf.org/html/rfc6749#appendix-A.4 "\"scope\"" Syntax")
 *  
 * @param {Object | Array} jsonResponse An array or object which represents a JSON response returned from a server.
 *  
 * @return {Boolean} True if the JSON object corresponds to a valid OAuth 2.0 Access Token Error response, false 
 *         otherwise.
 */
OAuth.AccessToken.SuccessfulResponse.isJsonResponseValid = function(jsonResponse) {
  
    // The response MUST BE a JSON object
    var valid = OAuth.ObjectUtils.isObject(jsonResponse);
    
    // The response MUST HAVE an 'access_token' parameter
    valid = valid && jsonResponse.hasOwnProperty('access_token');
    
    // The 'access_token' parameter MUST BE compliant with 
    // [Section A.12](https://tools.ietf.org/html/rfc6749#appendix-A.12 "\"access_token\" Syntax")
    // TODO
    
    // The response MUST HAVE a 'token_type' parameter
    valid = valid && jsonResponse.hasOwnProperty('token_type');
    
    // The 'token_type' parameter MUST BE compliant with
    // [Section A.13](https://tools.ietf.org/html/rfc6749#appendix-A.13 "\"token_type\" Syntax")
    // TODO
    
    // In an 'expires_in' parameter value is provided it MUST BE compliant with
    // [Section A.14](https://tools.ietf.org/html/rfc6749#appendix-A.14) "\"expires_in\" Syntax")
    if(valid && jsonResponse.hasOwnProperty('expires_in')) {
        
        // TODO
        // valid = valid && typeof response.expires_in === 'number';
        
    }
    
    // If a 'refresh_token' parameter value is provided it MUST BE compliant with
    // [Section A.17](https://tools.ietf.org/html/rfc6749#appendix-A.17 "\"refresh_token\" Syntax")
    if(valid && jsonResponse.hasOwnProperty('refresh_token')) {
        
        // TODO
        
    }
    
    // If 'scope' parameter value is provided it MUST BE compliant with
    // [Section 1.4](https://tools.ietf.org/html/rfc6749#appendix-A.4 "\"scope\"" Syntax")
    if(valid && jsonResponse.hasOwnProperty('scope')) {
        
        // TODO
        
    }

    return valid;

};