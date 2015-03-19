/**
 * Component used to parse an OAuth 2.0 Access Token, if the result of the parsing fails then this component MUST throw 
 * an Error.
 * 
 * If the access token request is valid and authorized, the authorization server issues an access token and optional 
 * refresh token as described in [Section 5.1](https://tools.ietf.org/html/rfc6749#section-5.1 "Section 5.1").  If the 
 * request failed client authentication or is invalid, the authorization server returns an error response as described 
 * in [Section 5.2](https://tools.ietf.org/html/rfc6749#section-5.2 "Section 5.2").
 * 
 * @author Baptiste GAILLARD (baptiste.gaillard@gomoob.com)
 */
OAuth.AccessToken.ResponseParser = function() {
    
    /**
     * Function used to parse a critical error which due to an entity body which is not expressed using a valid JSON 
     * string. Critial errors ARE NOT DEFINED by the OAuth 2.0 RFC and are used by OAuth.JS when the server returned 
     * invalid responses (i.e which are not compliant with the OAuth 2.0 RFC). Critical errors have error codes which 
     * are compliant with the following template : '__oauth_js__${errorCode}__'.
     * 
     * @param {XMLHttpRequest} xhr The XMLHttpRequest object used to send a request to the server and which led to the 
     *        creation of an error response.
     *        
     * @return {OAuth.AccessToken.ErrorResponse} The resulting OAuth.JS Access Token Response object.
     */
    function parseCriticalErrorNotJsonResponse(xhr) {

        var accessTokenResponse = new OAuth.AccessToken.CriticalErrorResponse();
        accessTokenResponse.setError('__oauth_js__entity_body_not_json__');
        accessTokenResponse.setXhr(xhr);
        
        return accessTokenResponse;

    }
    
    /**
     * Function used to parse a critical error which due to an entity body which is valid JSON string but is not a valid 
     * OAuth 2.0 JSON object. Critial errors ARE NOT DEFINED by the OAuth 2.0 RFC and are used by OAuth.JS when the 
     * server returned invalid responses (i.e which are not compliant with the OAuth 2.0 RFC). Critical errors have 
     * error codes which are compliant with the following template : '__oauth_js__${errorCode}__'.
     * 
     * @param {XMLHttpRequest} xhr The XMLHttpRequest object used to send a request to the server and which led to the 
     *        creation of an error response.
     * @param {Object | Array} jsonResponse A JSON object or array which is not a valid OAuth 2.0 JSON object.
     *        
     * @return {OAuth.AccessToken.ErrorResponse} The resulting OAuth.JS Access Token Response object.
     */
    function parseCriticalErrorResponse(xhr, jsonResponse) {

        var accessTokenResponse = new OAuth.AccessToken.CriticalErrorResponse();
        accessTokenResponse.setError('__oauth_js__entity_body_invalid_json__');
        accessTokenResponse.setJsonResponse(jsonResponse);
        accessTokenResponse.setXhr(xhr);
        
        return accessTokenResponse;

    }
    
    /**
     * Function used to parse a valid Error OAuth 2.0 Access Token response. Standard errors are errors defined by the 
     * OAuth 2.0 RFC in [Section 5.2](https://tools.ietf.org/html/rfc6749#section-5.2 "Section 5.2").
     * 
     * @param {XMLHttpRequest} xhr The XMLHttpRequest object used to send a request to the server and which led to the 
     *        creation of an error response.
     * @param {Object} jsonObject A JSON object which represents the valid Error OAuth 2.0 Access Token response.
     * 
     * @return {OAuth.AccessToken.ErrorResponse} The resulting OAuth.JS Access Token Response object.
     */
    function parseErrorResponse(xhr, jsonObject) {
        
        var accessTokenResponse = new OAuth.AccessToken.ErrorResponse();
        accessTokenResponse.setError(jsonObject.error);
        accessTokenResponse.setJsonResponse(jsonObject);
        accessTokenResponse.setXhr(xhr);

        return accessTokenResponse;

    }
    
    /**
     * Function used to parse a valid Successful OAuth 2.0 Access Token response. A successful OAuth 2.0 Access Token 
     * response is compliant with the [Section 5.1](https://tools.ietf.org/html/rfc6749#section-5.1 "Section 5.1") of 
     * the OAuth 2.0 specifications.
     * 
     * @param {XMLHttpRequest} xhr The XMLHttpRequest object used to send a request to the server and which led to the 
     *        creation of an error or successful response.
     * @param {Object} jsonObject A JSON object which represents a Successful OAuth 2.0 Access Token response.
     * 
     * @return {OAuth.AccessToken.CriticalErrorResponse | OAuth.AccessToken.SuccessfulResponse} The resulting OAuth.JS 
     *         Access Token Response object. The returned response is a critical one when the response body represents a 
     *         valid and successful OAuth 2.0 Access Token response but their is a problems in the returned HTTP headers
     *         . If everything is ok then a successful response object is returned. 
     */
    function parseSuccessfulResponse(xhr, jsonObject) {

        var accessTokenResponse = new OAuth.AccessToken.SuccessfulResponse();
        accessTokenResponse.setJsonResponse(jsonObject);
        accessTokenResponse.setXhr(xhr);
        
        // The XMLHttpRequest 'readyState' must be DONE
        // TODO:
        // '__oauth_js__ready_state_invalid__'

        // The XMLHttpRequest 'status' must be equal to 200 (OK)
        // @see https://tools.ietf.org/html/rfc6749#section-5.1
        // TODO: En fonction de la valeur de status
        // '__oauth_js__status_lt_1xx__',
        // '__oauth_js__status_1xx__',
        // '__oauth_js__status_2xx__',
        // '__oauth_js__status_3xx__',
        // '__oauth_js__status_4xx__',
        // '__oauth_js__status_5xx__',
        // '__oauth_js__status_gt_5xx__',
        
        // The authorization server MUST include the HTTP "Cache-Control" response header field [RFC2616] with a value 
        // of "no-store" in any response containing tokens, credentials, or other sensitive information, as well as the 
        // "Pragma" response header field [RFC2616] with a value of "no-cache".
        // TODO:
        // '__oauth_js__headers_bad_cache_control__'
        // '__oauth_js__headers_bad_pragma__'
        
        return accessTokenResponse;

    }

    /**
     * Function used to parse a server response following a POST request to a token endpoint (see 
     * [Section 3.2](https://tools.ietf.org/html/rfc6749#section-3.2 "Token Endpoint"). 
     * 
     * In this function the "parsing" has 2 purposes : 
     *  * Check that the HTTP Response body corresponds to a OAuth 2.0 Access Token Response.
     *  * Check that the returns HTTP headers are compliant with whats described in the OAuth 2.0 specifications.
     * 
     * @param {XMLHttpRequest} xhr The XMLHttpRequest object used to send a request to a Token Endpoint.
     * 
     * @return {OAuth.AccessToken.ErrorResponse | OAauth.AccessToken.SuccessfulResponse} An OAuth.JS Access Token 
     *         response which represents a successful or an error parsing.
     */
    this.parse = function(xhr) {

        ////////////////////////////////////////////////////////////////////////////////////////////////////////////////
        // Rules common to OAuth 2.0 Access Token Successful and Error responses
        ////////////////////////////////////////////////////////////////////////////////////////////////////////////////
        
        // The HTTP response MUST USE the "application/json" media type as defined by [RFC4627].
        // TODO:
        // __oauth_js__headers_bad_media_type__

        // Converts the entity-body into a JSON Response
        var jsonResponse = null, 
            response = null; 
        
        try {
            
            jsonResponse = JSON.parse(xhr.responseText);
            
            // The response expresses a valid OAuth 2.0 Access Token Error response
            if(OAuth.AccessToken.ErrorResponse.isJsonResponseValid(jsonResponse)) {

                response = parseErrorResponse(xhr, jsonResponse);

            } 
            
            // The response expresses a valid OAuth 2.0 Access Token Successful response
            else if(OAuth.AccessToken.SuccessfulResponse.isJsonResponseValid(jsonResponse)) {

                response = parseSuccessfulResponse(xhr, jsonResponse);

            }

            // The response expresses a valid JSON Type but is not a valid OAuth 2.0 Access Token Error response 
            // neither a valid OAuth 2.0 Access Token Successful response 
            else {

                response = parseCriticalErrorResponse(xhr, jsonResponse);

            }

        } catch(syntaxError) {

            // The HTTP Response does not contain a JSON body
            response = parseCriticalErrorNotJsonResponse(xhr);

        }

        return response;
    };
    
};
