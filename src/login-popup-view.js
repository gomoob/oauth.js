define([ 
         
           // Libraries
           'marionette',
           'raven',

           // Templates
           'text!app/mobile/tpl/views/popup/login-popup-view.tpl', 

           // User Connection Manager
           'app/mobile/user-connection-manager',
           
           // Application Configuration
           'application-configuration',
           
           // User Configuration
           'app/mobile/user-configuration'

       ],
       function(

           // Libraries
           Marionette,
           Raven,
           
           // Templates
           template, 

           // User Connection Manager
           userConnectionManager,
           
           // Application Configuration
           applicationConfiguration,
           
           // User Configuration
           userConfiguration

       ) {

    /**
     * Marionette view used to display a login popup.
     * 
     * This login popup can be display from many places in the application, it will be only opened if the application 
     * detects that the user is not connected to its account.
     * 
     * @author Baptiste GAILLARD (baptiste.gaillard@gomoob.com)
     */
    return Marionette.ItemView.extend({

        /**
         * The other attributes of the root HTML DOM element associated to this view. 
         */
        attributes : {
            
            'data-role'         : 'popup',
            'data-theme'        : 'a',
            'data-position-to'  : 'window'
                
        },
        
        /**
         * The CSS classes associated to the root DOM element of this view.
         */
        className : 'ui-corner-all',
        
        /**
         * Events bound to the DOM elements of this view.
         */
        events : {
            
            'tap @ui.cancelButton' : 'onCancelButtonTapped',
            'tap @ui.facebookConnectButton' : 'onFacebookConnectButtonTapped',
            'tap @ui.useConditionsButton' : 'onUseConditionsButtonTapped'
                
        },

        /**
         * The 'id' attribute of the root HTML DOM element associated to this view.
         */
        id: 'login-popup',
        
        /**
         * A callback function to be called when a successful login appeared.
         */
        successLoginCallback : null,

        /**
         * The template used to generate a HTML fragment for this view.
         */
        template : _.template(template),
        
        /**
         * The DOM elements which compose this view.
         */
        ui : {
            
            cancelButton : '#cancel-btn',
            facebookConnectButton : '#facebook-connect-btn',
            helpMessage : '#help-message',
            useConditionsCheckbox : '#use-conditions-checkbox',
            useConditionsButton : '#use-conditions-btn'
                
        },

        /**
         * Function just after the view is initialized.
         * 
         * @param {Object} options options used to initialize the view.
         */
        initialize: function(options) {},
        
        /**
         * Function used to perform a "transparent" or "manual" login.
         * 
         * Each time an authenticated action has to be performed this function has to be called. Then, this function 
         * checks if the currently connected user is already logged in with : 
         *  - The My Good Moment application / servers (i.e an access token exists on the local storage) 
         *  - Its Facebook Account.
         * 
         * If the user is already logged in with the My Good Moment / servers and its Facebook account then the function 
         * calls the success login callback directly. 
         * 
         * If the user is not already logged in then the function opens the login popup dialog box. Then if the user 
         * clicks on the login button of the dialog box and logged in with success the success callback is called.
         * 
         * NOTE: If their is not My Good Moment OAuth 2.0 access token on the local storage then the function also 
         *       retrieve a new OAuth 2.0 Access Token and stores it into the local storage.
         * 
         * @param {Function} successLoginCallback a callback function to be called when a successful login append.
         */
        login : function(successLoginCallback) {
            
            console.log('Try to perform a "transparent" login ...');

            // Checks if their is an OAuth 2.0 Access Token stored in the local storage
            var oAuth2AccessTokenResponse = userConfiguration.getOAuth2AccessTokenResponse(),
                promise;

            // If their is no OAuth 2.0 Access Token on the local storage we can be in the following situations : 
            //  - The application has just been installed
            //  - The user logged out previously and want to login again now
            //  - The user deleted its accounts and now wants to create a new one
            // 
            // In those situations we ask the user to login with Facebook and we retrieved a My Good Moment OAuth 2.0 
            // Access Token to store it on the local storage.
            if(typeof oAuth2AccessTokenResponse === 'undefined' || oAuth2AccessTokenResponse === null) {

                console.log('No OAuth 2.0 Access Token is stored in the local storage, try to renew it ...');
                
                promise = userConnectionManager.reniewOAuth2AccessToken();
                
            } 
            
            // We are here if the user has already logged in to the My Good Moment application
            else {
            
                promise = userConnectionManager.checkFacebookLoginStatus();    
              
            }

            promise.done($.proxy(function() {
                
                // Calls the success login callback
                successLoginCallback();
                
            }, this));
            
            promise.fail($.proxy(function() {

                // Backups the success login callback
                this.successLoginCallback = successLoginCallback;
                
                // Open the popup 
                this.open();
                
            }, this));

        },
        
        /**
         * Function used to handle tap event on cancel button.
         * 
         * @param {JQuery.Event} tapEvent the tap event.
         */
        onCancelButtonTapped : function(tapEvent) {
            
            // Prevents default tap event behavior
            tapEvent.preventDefault();
            
            // Closes the popup
            this.$el.popup('close');
            
        },
        
        /**
         * Function called when the view is closed.
         */
        onClose : function() {

            // Make sure that the popup widget is initialize before destroying it 
            this.$el.popup();
            this.$el.popup('destroy');
            this.$el.remove();
        
            // Fix to prevent the video to be playes when the popup shows over the video html element
            this.$el.css({visibility:'hidden'});
            $('.video-container video').css({visibility:'visible'});
            $('.video-container video').prop('controls', true);
            $('.video-container .overlay').show();
            
            $.mobile.loading('hide');
            
        },

        /**
         * Function called when the user tapped the facebook connect button.
         * 
         * @param {jQuery.Event} tapEvent the tap event which triggered a call to this function.
         */
        onFacebookConnectButtonTapped : function(tapEvent) {

            // Prevents default tap event behavior
            tapEvent.preventDefault();
            
            // Checks if the use conditions checkbox is checked
            if(this.ui.useConditionsCheckbox.is(':checked')) {
            
                this.$('.ui-checkbox label').removeClass('is-required');
                this.ui.helpMessage.hide();
                
                var promise = userConnectionManager.login();
                
                promise.done($.proxy(function() {
                    
                    // Calls the success login callback
                    this.successLoginCallback();

                    // Close the popup and free the view (this will also call the Marionette 'onClose' method)
                    this.close();
                    
                }, this));
                
                promise.fail($.proxy(function() {
                    
                    // Close the popup and free the view (this will also call the Marionette 'onClose' method)
                    this.close();
                    
                }, this));
                    
            }
        
            // Otherwise show a message
            else {
                
                this.$('.ui-checkbox label').addClass('is-required');
                this.ui.helpMessage.show();
                
            }
        
        },

        /**
         * Function called just after the view is rendered.
         */
        onRender : function() {}, 

        /**
         * Function called when the user taps the use conditions button.
         * 
         * @param {jQuery.Event} tapEvent the tap event which triggered a call to this function.
         */
        onUseConditionsButtonTapped : function(tapEvent) {
            
            tapEvent.preventDefault();
            
            window.open(applicationConfiguration.rootUrl + 'conditions-d-utilisation', '_blank', 'location=yes');

        },
        
        /**
         * Function used to open the popup associated to this view.
         */
        open : function() {

            // Renders the view
            this.render();
            
            // Fix to prevent the video to be playes when the popup shows over the video html element
            this.$el.css({visibility:'visible'});
            $('.video-container .overlay').show();
            $('video').css({visibility:'hidden'});
            $("video").prop('controls', false);
            
            // Appends the View DOM du the currentl JQuery Mobile page, in JQuery mobile popups have to be inside pages
            $.mobile.activePage.append(this.$el);

            // Opens the popup
            this.$el.popup({positionTo : 'window'});
            this.ui.useConditionsCheckbox.checkboxradio();
            this.$el.popup('open');
            
            // When the JQuery Mobile popup is closed calls the Marionette close method to desroy this view and withdraw 
            // it from the DOM
            this.$el.on("popupafterclose", $.proxy(function( event, ui ) {

                this.close();

            }, this));

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
        reniewOAuth2AccessToken : function(successLoginCallback) {
            
            promise = userConnectionManager.reniewOAuth2AccessToken();
            
            promise.done($.proxy(function() {
                
                // Calls the success login callback
                successLoginCallback();
                
            }, this));
            
            promise.fail($.proxy(function() {
    
                // Backups the success login callback
                this.successLoginCallback = successLoginCallback;
                
                // Open the popup 
                this.open();
                
            }, this));
            
        }
        
    });

});
