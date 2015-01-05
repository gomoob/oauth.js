define([ 'jquery', 
         'backbone', 
         'underscore', 
         'gomoob-url-utils',
         'app/mobile/views/popup/login-popup-view'], function($, Backbone, _, UrlUtils, LoginPopupView) {

    /**
     * Utility function used to refresh the OAuth 2.0 Access Token, if the refresh operation fails the function calls 
     * the 'reniewOAuth2AccessToken()' function to reniew the OAuth 2.0 Access Token (will a potential login Modal).
     */
    function refreshAccessToken() {

        var accessTokenResponseString = localStorage.getItem('mygoodmoment.oauth2.accessTokenResponse');
        
        // If an OAuth2 Access Token is stored we use the refresh token in it
        if(typeof accessTokenResponseString !== 'undefined' && accessTokenResponseString !== null) {

            var accessTokenResponse = JSON.parse(accessTokenResponseString);
            
            // Try to refresh the access token and reload the last opened page if the 
            // retrieval is successful
            Backbone.$.ajax({
                url : UrlUtils.buildUrl('rest/token'), 
                data : {
                    'grant_type' : 'refresh_token',
                    'refresh_token' : accessTokenResponse.refresh_token
                }, 
                dataType : 'json',
                type: 'POST',
                error : function() {
                    
                    // Try to login again and reload the last opened page if a login is successful
                    reniewOAuth2AccessToken();

                }, 
                success : function(data, textStatus, jqXHR) {

                    // Store the refresed OAuth 2.0 in the local storage
                    // WARNING: Please not that besides the standard OAuth 2.0 Access Token informations the response 
                    //          also contain a 'user_id' field which is specific to the project and contains the 
                    //          technical identifier of the user on the platform 
                    localStorage.setItem('mygoodmoment.oauth2.accessTokenResponse', JSON.stringify(data));

                    // Reloads the current view
                    reloadCurrentView();

                }

            });

        }
        
    }
    
    /**
     * Utility function used to force a reload of the current view by adding a 'reload' parameter in the URL with a 
     * random number for force the Browser believe we want to change of page. 
     */
    function reloadCurrentView() {

        // Generates a random number to reload the previously loaded view
        var rand = Math.floor(Math.random() * 1000);

        // Inserts a 'reload' parameter in the URL to force the browser to trigger a hash 
        // event and the application to automatically reload its current page
        if(window.location.hash.indexOf('?') === -1) {

            window.location.hash = window.location.hash + '?reload=' + rand;

        } else {

            window.location.hash = window.location.hash + '&reload=' + rand;

        }
        
    }
    
    /**
     * Utility function to be called when the OAuth 2.0 Access Token is not available on the local storage or cannot be 
     * refresh using an OAuth 2.0 Access Token. 
     * 
     * This function will try to transparently reniew the OAuth 2.0 Access Token, if not possible a popup will be opened 
     * to ask to the user to login again.
     */
    function reniewOAuth2AccessToken() {

        var loginPopupView = new LoginPopupView();

        // Try to login again and reload the last opened page if a login is successful
        loginPopupView.reniewOAuth2AccessToken(function() {

            // Reloads the current view
            reloadCurrentView();
  
        });
        
    }
    
    return {

        /**
         * Function used to overwrite the 'Backbone.ajax' method to manage accesses to Web Services secured using an 
         * OAuth 2.0 access token.
         * 
         * Each time a query is performed this new / overwitten 'Backbone.ajax' function  tries to find an OAuth 2.0 
         * access token stored in the local storage. If their is an OAuth 2.0 access token stored in the local storage 
         * then an 'access_token=xxxx' parameter is automatically added to the URL parameters. 
         * 
         * If a 401 error linked to an OAuth 2.0 invalid token is encountered then the function performs the following 
         * tasks : 
         *  - Try to "transparently" login using an 'FB.getLoginStatus' and retrieving a new OAuth 2.0 access token.
         *  - If the "transparent" login failed then opens the login modal box to the user
         *  - If the login is successful reloads the current page
         */
        overwriteAjax : function() {
            
            Backbone.ajax = function() {

                // Try to get a OAuth2 Access Token Response from the local storage
                var accessTokenResponseString = localStorage.getItem('mygoodmoment.oauth2.accessTokenResponse');

                // If an OAuth2 Access Token is stored then we add it to the URL parameters
                if(typeof accessTokenResponseString !== 'undefined' && accessTokenResponseString !== null) {

                    var accessTokenResponse = JSON.parse(accessTokenResponseString);

                    if(arguments[0].url.indexOf('?') !== -1) {
                        
                        arguments[0].url = arguments[0].url + '&access_token=' + accessTokenResponse.access_token;
                        
                    } else {
                        
                        arguments[0].url = arguments[0].url + '?access_token=' + accessTokenResponse.access_token;
                        
                    }

                }
                
                var jQueryAjaxPromise = Backbone.$.ajax.apply(Backbone.$, arguments);
                
                jQueryAjaxPromise.fail(function(jqXHR, status, errorThrown) {

                    // If we are on a 401 HTTP error response (i.e Unauthorized)
                    if(jqXHR.status === 401) {

                        // Checks if the returned response is a JSON one and is a valid API Problem response
                        if(jqXHR.responseJSON !== null && typeof jqXHR.responseJSON !== 'undefined') {

                            // If their is a 'title' attached to the response this is an API Problem with a potential 
                            // OAuth 2.0 error code
                            if(jqXHR.responseJSON.title !== null && typeof jqXHR.responseJSON.title !== 'undefined') {
                            
                                // The OAuth 2.0 Access Token which was send with the request is invalid, the 401 Status 
                                // code with the error code 'invalid_token' can express multiple errors : 
                                //  - The provided Access Token does not exist on server side (can be an error from the 
                                //    client or a clear on server side)
                                //  - The provided Access Token has expired
                                if(jqXHR.responseJSON.title === 'invalid_token') {

                                    // The OAuth 2.0 Access Token is invalid, in this case we try to reniew the Access 
                                    // Token without a Refresh Token. That's to say by providing the user credentials 
                                    // and potentially open a new Login Dialog
                                    if(jqXHR.responseJSON.errorCode === 'token_invalid') {

                                        console.warn('The provided OAuth 2.0 Access Token is invalid.');
                                        console.log('Try to reniew the OAuth 2.0 Access Token by login.');

                                        // Try to login again and reload the last opened page if a login is successful
                                        reniewOAuth2AccessToken();

                                    } 
                                    
                                    // The OAuth 2.0 Access Token has expired, in this case we first try to refresh the 
                                    // Access Token using the 'refresh_token'
                                    else if(jqXHR.responseJSON.errorCode === 'token_expired') {
                                        
                                        console.log('The provided OAuth 2.0 Access Token has expired.');
                                        console.log('Try to refresh the OAuth 2.0 Access Token using a "refresh_token".');

                                        // Try to refresh the OAuth 2.0 Access Token, if not possible reniew it
                                        refreshAccessToken();

                                    } 
                                    
                                    // The OAuth 2.0 Access Token is Malformed (missing "expires" or "client_id"), this 
                                    // error should never appear and has to be considered a client coding error.
                                    else if(jqXHR.responseJSON.errorCode === 'token_malformed') {
                                        
                                        console.warn('The provided OAuth 2.0 Access Token is malformed.');
                                        console.log('Try to reniew the OAuth 2.0 Access Token by login.');
                                        
                                        // Try to login again and reload the last opened page if a login is successful
                                        reniewOAuth2AccessToken();

                                    }
                                    
                                    // Unknown invalid token error, this should never appear !!!
                                    else {

                                        // TODO: Envoi de l'erreur vers Sentry !
                                        console.log('Invalid token !');
                                        console.log(jqXHR.responseJSON);

                                    }

                                }
                                 
                            }
                         
                        }
                        
                    } 

                    // Error not manageable
                    else {

                        // TODO: Erreur inconnue, pas sûr on a encore des codes d'erreurs connus ?
                        console.log('Error !');
                        console.log(JSON.stringify(jqXHR));
                        console.log(errorThrown);

                    }

                });
                
                return jQueryAjaxPromise;
                
            };
            
        }
        
    };
    
});