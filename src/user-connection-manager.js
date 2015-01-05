define([
        
            // Libraries
            'jquery', 
            'backbone',
            'mygoodmoment.model',
            'raven',
           
            // Push Notification Manager
            'app/mobile/push-notification-manager',
           
            // User configuration
            'app/mobile/user-configuration'
        
        ], function(
            
            // Libraries
            $, 
            Backbone,
            MyGoodMoment,
            Raven,
            
            // Push Notification Manager
            pushNotificationManager,
            
            // User configuration
            userConfiguration
            
        ) {

    /**
     * Component used to manage User connections.
     * 
     * <p>WARNING: This component requires the Apache / Cordova Pushwoosh and Facebook Connect plugins.</p>
     * 
     * @author Simon BAUDRY (simon.baudry@gomoob.com)
     */
    return {
        
        /**
         * Function used to reniew the My Good Moment OAuth 2.0 Access Token. 
         * 
         * This method has to be called when a OAuth 2.0 Access Token failure is encountered while called a secured My 
         * Good Moment REST Web Services (in general it appears in the modified Backbone.ajax method of the project).
         * 
         * @param {Function} successLoginCallback a callback function to be called after a successful login / OAuth 2.0 
         *        Access Token reniewal is performed.
         */
        checkFacebookLoginStatus : function() {

            // Declare a new promise to allow asynchronous handlers  
            var promise = new $.Deferred();
            
            console.log('Getting Facebook login status of user ...');
          
            $.mobile.loading('show');
            
            // Checks if the users is currently connected to Facebook and has autorized the My Good Moment Facebook 
            // application
            facebookConnectPlugin.getLoginStatus(
                $.proxy(this.onCheckFacebookLoginStatusSuccess, this, promise),
                $.proxy(this.onCheckFacebookLoginStatusError, this, promise)
            );
            
            return promise;
            
        },
        
        /**
         * Function used to handle the login of a connected user.
         * 
         * @return {JQuery.Promise} A Deferred's Promise object.
         */
        login : function() {

            // Declare a new promise to allow asynchronous handlers  
            var promise = new $.Deferred();
            
            console.log('Try to login the user ...');
          
            $.mobile.loading('show');
            
            // Try to connect with Facebook user account threw the Facebook Connect Plugin
            facebookConnectPlugin.login(
                ['public_profile', 'email'],
                $.proxy(this.onFacebookLoginSuccess, this, promise), 
                $.proxy(this.onFacebookLoginError, this, promise)
            );
            
            return promise;
            
        },
        
        /**
         * Function used to handle the logout of a connected user.
         * 
         * @return {JQuery.Promise} A Deferred's Promise object.
         */
        logout : function() {

            // Declare a new promise to allow asynchronous handlers  
            var promise = new $.Deferred();
            
            console.log('Try to logout the user ...');

            // Shows the JQuery Mobile Loading Panel
            $.mobile.loading('show');
            
            // First we logout from Facebook
            facebookConnectPlugin.logout(
                $.proxy(this.onFacebookLogoutSuccess, this, promise),
                $.proxy(this.onFacebookLogoutError, this, promise)
            );
            
            return promise;

        },

        /**
         * Function called after a failed 'FB.getLoginStatus()' call.
         * 
         * WARNING: This method is not called by the Facebook Javascript 'FB.getLoginStatus()' method but by the 
         *          Phonegap / Cordova plugin 'FB.getLoginStatus()' method. Normally this method should only be called 
         *          if the Facebook SDK has not been initialized (which should never appear).
         * 
         * @param {JQuery.promise} promise the promise object used to triggered asynchronous code.
         * @param {String} errorMessage the error message explaining the reasons of the error.
         */
        onCheckFacebookLoginStatusError : function(promise, errorMessage) {
          
            console.error('Fail to call "FB.getLoginStatus()" !');
            console.error(errorMessage);
            
            Raven.captureMessage('Fail to call "FB.getLoginStatus()" ! - ' + errorMessage);
            
            // Rejects the promise object
            promise.reject(errorMessage);
            
            // Hides the JQuery Mobile Loading Panel
            $.mobile.loading('hide');
            
        },

        /**
         * Function called after a successful 'FB.getLoginStatus()' call.
         * 
         * NOTE: This function DOES NOT reniew the My Good Moment OAuth2.0 Access Token.
         * 
         * @param {JQuery.promise} promise the promise object used to triggered asynchronous code.
         * @param {Object} response the successful Facebook auth response, WARNING: The response is not the same with 
         * the Apache / Cordova plugin and the Facebook Javascript SDK :
         *  - The states returned by the Javascript SDK are returned int the 'response.status' field and are  
         *    documented here : https://developers.facebook.com/docs/reference/javascript/FB.getLoginStatus
         *    With the Javascript SDK the response has the following structure : 
         *    <verbatim>
         *     {
         *         "authResponse": {
         *             "accessToken"   : "XXXXXXXX",
         *             "session_key"   : true,
         *             "expiresIn"     : "5175609",
         *             "userId"        : "XXXXXXXX",
         *             "sig"           : "...",
         *             "signedRequest" : "XXXXXXX"
         *         },
         *         "status" : "connected"
         *     }
         *    </verbatim>
         *    
         *  - The states returned by the Phonegap / Cordova plugin are returned directly in 'response' and are 
         *    documented here : https://developers.facebook.com/docs/reference/android/current/class/SessionState 
         *    Please not that this is because of an Phonegap / Cordova Facebook plugin Bug !!!
         *    https://github.com/phonegap/phonegap-facebook-plugin/issues/467
         * 
         * NOTE: - The 'sig' seems to only be their using the Phonegap / Cordova plugin.
         *       - The 'signedRequest' seems to only be their without the Phonegap / Cordova plugin (i.e using a 
         *         standard Desktop browser and the Facebook JS SDK)
         */
        onCheckFacebookLoginStatusSuccess : function(promise, response) {

            // The user is logged in and has authenticated the My Good Moment application, and response.authResponse 
            // supplies the user's ID, a valid Facebook Access Token, a signed request, and the time the access token 
            // and signed request each expired
            if(response.status === 'connected' || (typeof response === 'string' && response === 'OPENED')) {

                console.log('The user is connected with its Facebook account and authorized the application.');

                // Resolves the promise object
                promise.resolve(response);

            } 
            
            // The user is logged in to Facebook but has not authenticated the My Good Moment application.
            else if(response.status === 'not_authorized') {
                
                console.log('The user is connected with its Facebook account but did not authorized the application.');

                // Rejects the promise object
                promise.reject(response);

            }

            // The user isn't logged in to Facebook
            else {

                console.log('The user is not connected to its Facebook account.');

                // Rejects the promise object
                promise.reject(response);
                
            }

            // Hides the JQuery Mobile Loading Panel
            $.mobile.loading('hide');
            
        },
        
        /**
         * Function called when a Facebook Auth Response has failed to be taken into account by the My Good Moment 
         * servers.
         * 
         * @param {JQuery.promise} promise the promise object used to triggered asynchronous code.
         * @param {jqXHR} jqXHR the JQuery AJAX XHR object.
         * @param {String} textStatus the status of the request, can be "timeout", "error", "abort" or "parserror".
         * @param {String} errorThrown When an HTTP error occurs, errorThrown receives the textual portion of the HTTP 
         *        status, such as "Not Found" or "Internal Server Error."
         */
        onFacebookAuthResponseError : function(promise, jqXHR, textStatus, errorThrown) {

            console.error('Fail to create FacebookAuthResponse !');
            console.error(jqXHR);
            console.error(textStatus);
            console.error(errorThrown);
            
            navigator.notification.alert(
                'La connection avec Facebook a échoué !',
                $.noop(), 
                'Erreur de connection !'
            );
            
            Raven.captureMessage('Fail to create FacebookAuthResponse !' +  
                    ' - jqXHR : ' + JSON.stringify(jqXHR) + 
                    ' - textStatus : ' + JSON.stringify(textStatus) +
                    ' - errorThrown : ' + JSON.stringify(errorThrown));

            // Clear user configuration stores into local storage
            userConfiguration.clearAll();
            
            // Hides the JQuery Mobile Loading Panel
            $.mobile.loading('hide');
            
            // Rejects the promise
            promise.reject(jqXHR, textStatus, errorThrown);
            
        },
        
        /**
         * Function called when a Facebook Auth Response has been successfully taken into account by the server. When 
         * this function is called we can be in 2 scenarios : 
         *  - This is a first time the user performs a Facebook Connect with the application, in this case the server 
         *    created a new application user account on server side and returns an OAuth2 Access Token which can be used 
         *    to perform Web Service REST requests later.
         *  - This is not the first time the user performs a Facebook Connect with the application, in this case the 
         *    server updates the existing user account of the user and returns an OAuth2 Access Token which can be used 
         *    to perform Web Service REST requests later.
         *    
         * The returned OAuth2 Access Token Response can contain a Refresh Token which can be used to refresh the Access 
         * Token.
         *
         * @param {JQuery.promise} promise the promise object used to triggered asynchronous code.
         * @param {OAuth2AccessTokenResponse} oAuth2AccessTokenResponse the OAuth2 Access Token response returned by the 
         *        server. This object is compliant with the OAuth2 specifications and can contain the following elements
         *        : 
         *        - id               : THIS IS NOT specified by the OAuth2 Specification, the field will contain the 
         *                             Facebook Access Token sent from the client.
         *        - action_performed : THIS IS NOT specified by the OAuth2 Specification, this field indicates if the 
         *                             request lead to a new user account creation "user_account_creation" or an exising 
         *                             user account update "user_account_update".
         *        - user_id          : THIS IS NOT specified by the OAuth 2.0 Specification this field will contains the
         *                             technical identifier of the User Account of the Application.
         *        - access_token     : The access token issued by the authorization server.
         *        - expires_in       : The lifetime in seconds of the access token.  For example, the value "3600" 
         *                             denotes that the access token will expire in one hour from the time the response 
         *                             was generated. If omitted, the authorization server SHOULD provide the expiration 
         *                             time via other means or document the default value.
         *        - token_type       : The type of the token issued as described in Section 7.1
         *                             (http://tools.ietf.org/html/rfc6749#section-7.1). Value is case insensitive.
         *        - scope            : OPTIONAL, if identical to the scope requested by the client; otherwise, REQUIRED.  
         *                             The scope of the access token as described by Section 3.3.
         *                             (http://tools.ietf.org/html/rfc6749#section-3.3).
         *        - refresh_token    : The refresh token, which can be used to obtain new access tokens using the same
         *                             authorization grant as described in Section 6
         *                             (http://tools.ietf.org/html/rfc6749#section-6).
         * @param {String} textStatus the status of the request, its always equal to "success" here.
         * @param {jqXHR} jqXHR the JQuery AJAX XHR object.
         */
        onFacebookAuthResponseSuccess : function(promise, oAuth2AccessTokenResponse, textStatus, jqXHR) {

            // Configures Sentry client with authentication identifiers of the connected user
            Raven.setUser({
                id : oAuth2AccessTokenResponse.user_id,
                facebookAccessToken : oAuth2AccessTokenResponse.id,
                myGoodMomentAccessToken : oAuth2AccessTokenResponse.access_token
            });
            
            // Backups the OAuth 2.0 Access Token Response in the HTML5 local storage
            userConfiguration.setOAuth2AccessTokenResponse(oAuth2AccessTokenResponse);
            
            // Sets default configuration 
            userConfiguration.setSaveVideos(true);
            
            pushNotificationManager.registerDevice({
                success : $.proxy(function() {
                    
                    // Persists the fact that the Push Notifications are enabled on the local storage, this will be read at 
                    // application start to perform a device registration
                    userConfiguration.setPushNotifications(true);

                    // Resolves the promise
                    promise.resolve(oAuth2AccessTokenResponse);

                    // Hides the JQuery Mobile Loading Panel
                    $.mobile.loading('hide');

                }, this), 
                error : $.proxy(function() {
                    
                    // TODO: On devrait indiquer à l'utilisateur que l'opération a échouée 
                    console.warn('Fail to register device !');

                    // Resolves the promise
                    promise.resolve(oAuth2AccessTokenResponse);

                    // Hides the JQuery Mobile Loading Panel
                    $.mobile.loading('hide');
                    
                }, this)
            });
            
        },
        
        /**
         * Function triggered when a login of a Facebook User session has failed.
         * 
         * @param {JQuery.promise} promise the promise object used to triggered asynchronous code. 
         * @param string errorMessage the errorMessage passed by the Apache / Cordova Facebook connect plugin.
         */
        onFacebookLoginError : function(promise, errorMessage) {
            
            console.log('Facebook login error !');
            console.log(errorMessage);
            
            Raven.captureMessage('Facebook login error !' +  JSON.stringify(errorMessage));
            
            // Hides the JQuery Mobile Loading Panel
            $.mobile.loading('hide');

            // Rejects the promise
            promise.reject(errorMessage);
            
        },
        
        /**
         * Function triggered when a Facebook User session has been successfully login.
         * 
         * @param {JQuery.promise} promise the promise object used to triggered asynchronous code.
         * @param string response the response passed by the Apache / Cordova Facebook connect plugin.  
         */
        onFacebookLoginSuccess : function(promise, response) {
            
            console.log('Facebook login successful !');
            console.log('The Facebook Auth Response to send on My Good Moment servers is ...');
            console.log(JSON.stringify(response));
                
            // Creates a Facebook Auth Response
            var facebookAuthResponse = new MyGoodMoment.Model.FacebookAuthResponse(response.authResponse), 
                deviceEntity = userConfiguration.getDeviceEntity();
            
            // While connecting the user to its user account on our application we send a 'device_id' parameter to allow 
            // the servers to associate the user account to its device. This will allow the server to send push 
            // notifications to the user devices when needed.
            if(typeof deviceEntity !== 'undefined' && deviceEntity !== null && deviceEntity.has('pushwooshHWID')) {

                facebookAuthResponse.set('device_pushwooshHWID', deviceEntity.get('pushwooshHWID'));

            }
            
            Backbone.sync(
                'create',
                facebookAuthResponse,
                {
                    success : $.proxy(this.onFacebookAuthResponseSuccess, this, promise),
                    error : $.proxy(this.onFacebookAuthResponseError, this, promise)
                }
            );
            
        },
        
        /**
         * Function triggered when a logout of a Facebook User session has failed.
         * 
         * @param {JQuery.promise} promise the promise object used to triggered asynchronous code. 
         * @param string errorMessage the errorMessage passed by the Apache / Cordova Facebook connect plugin.
         */
        onFacebookLogoutError : function(promise, errorMessage) {
            
            console.log('Facebook logout error !');
            console.log(errorMessage);
            
            Raven.captureMessage('Facebook logout error !' +  JSON.stringify(errorMessage));
            
            // Clear user configuration stores into local storage
            userConfiguration.clearAll();
            
            // Hides the JQuery Mobile Loading Panel
            $.mobile.loading('hide');

            // Rejects the promise
            promise.reject(errorMessage);
            
        },
        
        /**
         * Function triggered when a Facebook User session has been successfully logout.
         * 
         * @param {JQuery.promise} promise the promise object used to triggered asynchronous code.
         * @param string response the response passed by the Apache / Cordova Facebook connect plugin.  
         */
        onFacebookLogoutSuccess : function(promise, response) {
            
            console.log('Facebook logout successful !');

            // TODO: Invalider le token OAuth 2.0 du serveur et le supprimer du local storage ...
            
            // Clear user configuration stores into local storage
            userConfiguration.clearAll();
            
            // Hides the JQuery Mobile Loading Panel
            $.mobile.loading('hide');
            
            // Resolves the promise
            promise.resolve(response);

        },

        /**
         * Function called after a failed 'FB.getLoginStatus()' call.
         * 
         * WARNING: This method is not called by the Facebook Javascript 'FB.getLoginStatus()' method but by the 
         *          Phonegap / Cordova plugin 'FB.getLoginStatus()' method. Normally this method should only be called 
         *          if the Facebook SDK has not been initialized (which should never appear).
         * 
         * @param {String} errorMessage the error message explaining the reasons of the error.
         */
        onFacebookGetLoginStatusForOAuth2AccessTokenReniewalError : function(promise, errorMessage) {
          
            console.error('Fail to call "FB.getLoginStatus()" for OAuth2AccessTokenReniewal !');
            console.error(errorMessage);
            
            Raven.captureMessage('Fail to call "FB.getLoginStatus()" for OAuth2AccessTokenReniewal ! - ' + errorMessage);

            // Rejects the promise
            promise.reject(errorMessage);
            
        },
        
        /**
         * Function called after a successful 'FB.getLoginStatus()' call, the purpose of this function is to retrieve an 
         * up to date Facebook Access Token and use it to reniew the My Good Moment OAuth 2.0 Access Token (which will 
         * be used later to perform secured Web Services calls). 
         * 
         * NOTE: This function ALWAYS reniew the My Good Moment OAuth2.0 Access Token.
         * 
         * @param {Object} response the successful Facebook auth response, WARNING: The response is not the same with 
         * the Apache / Cordova plugin and the Facebook Javascript SDK :
         *  - The states returned by the Javascript SDK are returned int the 'response.status' field and are  
         *    documented here : https://developers.facebook.com/docs/reference/javascript/FB.getLoginStatus
         *    With the Javascript SDK the response has the following structure : 
         *    <verbatim>
         *     {
         *         "authResponse": {
         *             "accessToken"   : "XXXXXXXX",
         *             "session_key"   : true,
         *             "expiresIn"     : "5175609",
         *             "userId"        : "XXXXXXXX",
         *             "sig"           : "...",
         *             "signedRequest" : "XXXXXXX"
         *         },
         *         "status" : "connected"
         *     }
         *    </verbatim>
         *    
         *  - The states returned by the Phonegap / Cordova plugin are returned directly in 'response' and are 
         *    documented here : https://developers.facebook.com/docs/reference/android/current/class/SessionState 
         *    Please not that this is because of an Phonegap / Cordova Facebook plugin Bug !!!
         *    https://github.com/phonegap/phonegap-facebook-plugin/issues/467
         * 
         * NOTE: - The 'sig' seems to only be their using the Phonegap / Cordova plugin.
         *       - The 'signedRequest' seems to only be their without the Phonegap / Cordova plugin (i.e using a 
         *         standard Desktop browser and the Facebook JS SDK)
         */
        onFacebookGetLoginStatusForOAuth2AccessTokenReniewalSuccess : function(promise, response) {

            // The user is logged in and has authenticated the My Good Moment application, and response.authResponse 
            // supplies the user's ID, a valid Facebook Access Token, a signed request, and the time the access token 
            // and signed request each expired
            if(response.status === 'connected' || (typeof response === 'string' && response === 'OPENED')) {

                console.log('The user is connected with its Facebook account and authorized the application.');

                // Calls the 'onFacebookLoginSuccess' method to automatically reniew the My Good Moment OAuth 2.0 Access 
                // Token
                this.onFacebookLoginSuccess(promise, response);
                
            }

            // The user is logged in to Facebook but has not authenticated the My Good Moment application.
            else if(response.status === 'not_authorized') {
                
                console.log('The user is connected with its Facebook account but did not authorized the application.');
                
                // Rejects the promise
                promise.reject(response);
                
            } 

            // The user isn't logged in to Facebook
            else {

                console.log('The user is not connected to its Facebook account.');

                // Rejects the promise
                promise.reject(response);
                
            }

        },
        
        /**
         * Function used to reniew the My Good Moment OAuth 2.0 Access Token. 
         * 
         * This method has to be called when a OAuth 2.0 Access Token failure is encountered while called a secured My 
         * Good Moment REST Web Services (in general it appears in the modified Backbone.ajax method of the project).
         * 
         * @param {Function} successLoginCallback a callback function to be called after a successful login / OAuth 2.0 
         *        Access Token reniewal is performed.
         */
        reniewOAuth2AccessToken : function() {

            // Declare a new promise to allow asynchronous handlers  
            var promise = new $.Deferred();
            
            console.log('Getting Facebook login status of user ...');
            
            // Checks if the users is currently connected to Facebook and has autorized the My Good Moment Facebook 
            // application
            facebookConnectPlugin.getLoginStatus(
                $.proxy(this.onFacebookGetLoginStatusForOAuth2AccessTokenReniewalSuccess, this, promise),
                $.proxy(this.onFacebookGetLoginStatusForOAuth2AccessTokenReniewalError, this, promise)
            );
            
            return promise;
            
        }
        
    };

});
