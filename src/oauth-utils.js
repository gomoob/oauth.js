define([], function() {

    /**
     * Utility function for OAuth 2.0.
     * 
     * @author Baptiste Gaillard (baptiste.gaillard@gomoob.com)
     */
    return {

        /**
         * Utility function used to know if a server response is an OAuth 2.0 error.
         * 
         * @param {Object} jqXHR the server side response to parse.
         * 
         * @return {Boolean} true if the response expresses an OAuth 2.0 error, false otherwise.
         */
        isOAuthError : function(jqXHR) {

            var isOAuth = false;

            // Checks if the returned response is a JSON one and is a valid API Problem response
            if(jqXHR.responseJSON !== null && typeof jqXHR.responseJSON !== 'undefined') {
            
                // If their is a 'title' attached to the response this is an API Problem with a potential 
                // OAuth 2.0 error code
                if(jqXHR.responseJSON.title !== null && typeof jqXHR.responseJSON.title !== 'undefined') {
                    
                    // If we are on a 401 HTTP error response (i.e Unauthorized)
                    if(jqXHR.status === 401) {
                    
                        // The OAuth 2.0 Access Token which was send with the request is invalid, the 401 Status 
                        // code with the error code 'invalid_token' can express multiple errors : 
                        //  - The provided Access Token does not exist on server side (can be an error from the 
                        //    client or a clear on server side)
                        //  - The provided Access Token has expired
                        if(jqXHR.responseJSON.title === 'invalid_token') {
                            
                            isOAuth = true;
                            
                        }
                        
                    }
                    
                }
                    
            }
                
            return isOAuth;
            
        }
        
    };

});
