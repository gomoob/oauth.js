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
     * response headers. If you server implementation is bad this value can also be an array (because your server 
     * returned a valid JSON array, in this case the response is a critical one with a code equals to 
     * '__oauth_js__entity_body_not_json__'). If your server returned a JSON object which is not compliant with the 
     * OAuth 2.0 specification this attribute is set with this bad object (in this case the response is a critical one 
     * with a code equals to '__oauth_js__entity_body_invalid_json__'). 
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
     * response headers. If you server implementation is bad this value can also be an array (because your server 
     * returned a valid JSON array, in this case the response is a critical one with a code equals to 
     * '__oauth_js__entity_body_not_json__'). If your server returned a JSON object which is not compliant with the 
     * OAuth 2.0 specification this attribute is set with this bad object (in this case the response is a critical one 
     * with a code equals to '__oauth_js__entity_body_invalid_json__'). 
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
     * @return {XHMLHttpRequest} The XMLHttpRequest object which was used to send a request on server side and which led 
     *         to the creation of this OAuth 2.0 Access Token response.
     */
    this.getXhr = function() {
        
        return _xhr;
        
    };
    
    /**
     * Sets an object or array which represents the JSON response returned from the server. This attribute can null when 
     * the server returned a response which did not represent a valid JSON type or if an error is encountered in the 
     * response headers. If you server implementation is bad this value can also be an array (because your server 
     * returned a valid JSON array, in this case the response is a critical one with a code equals to 
     * '__oauth_js__entity_body_not_json__'). If your server returned a JSON object which is not compliant with the 
     * OAuth 2.0 specification this attribute is set with this bad object (in this case the response is a critical one 
     * with a code equals to '__oauth_js__entity_body_invalid_json__'). 
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