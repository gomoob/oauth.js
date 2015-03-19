(function(root, factory) {
    
    if (typeof define === 'function' && define.amd) {
        
        define([], function() {

            return (root.OAuth = factory(root));

        });
    
    }
  
    else if (typeof exports !== 'undefined') {
    
        module.exports = factory(root);

    }
    
    else {
    
        root.OAuth = factory(root);
    
    }
    
}(this, function(root) {

    'use strict';
    
    /**
     * @namespace OAuth
     */
    var OAuth = {
             
          /**
           * @namespace OAuth.AccessToken
           */
          AccessToken : {},
                 
          /**
           * @namespace OAuth.Error
           */
          Error : {},
                  
          /**
           * @namespace OAuth.Request
           */
          Request : {}

    };

    /**
     * Class used to provide utilities to manage Augmented Backus-Naur Form (ABNF) Syntax used in the OAuth 2.0 
     * specifications. Details about ABNF and OAuth 2.0 can be found in 
     * [Appendix A.](https://tools.ietf.org/html/rfc6749#appendix-A "Augmented Backus-Naur Form (ABNF) Syntax").
     * 
     * @author Baptiste GAILLARD (baptiste.gaillard@gomoob.com)
     * @class FunctionUtils
     * @memberof OAuth
     * @see https://tools.ietf.org/html/rfc6749#appendix-A
     */
    OAuth.ABNFUtils = {
        
        /**
         * Function used to check if a string is compliant with a `grant-name` (i.e compliant with `1*name-char`).
         *  
         * @param {String} string The string to check.
         * 
         * @return {Boolean} True if the string is compliant with a `grant-name`, false otherwise.
         */
        isValidGrantName : function(string) {
      
            // TODO
            
        },
                   
        /**
         * Function used to check if a string is compliant with a `grant-type` (i.e compliant with 
         * `grant-name / URI-reference`).
         *  
         * @param {String} string The string to check.
         * 
         * @return {Boolean} True if the string is compliant with a `grant-type`, false otherwise.
         */
        isValidGrantType : function(string) {
            
            // TODO
            
        },
        
        /**
         * Function used to check if a string is compliant with a `name-char` (i.e compliant with 
         * `"-" / "." / "_" / DIGIT / ALPHA`).
         *  
         * @param {String} string The string to check.
         * 
         * @return {Boolean} True if the string is compliant with a `name-char`, false otherwise.
         */
        isValidNameChar : function(string) {
            
            // TODO
            
        },
    
        /**
         * Function used to check if a string is compliant with `1*DIGIT`.
         * 
         * @param {String} string The string to check.
         * 
         * @return {Boolean} True if the string is compliant with `1*DIGIT`, false otherwise.
         */
        isValidOneStarDIGIT : function(string) {
            
            // TODO
            
        },
        
        /**
         * Function used to check if a string is compliant with `1*NQCHAR`.
         * 
         * @param {String} string The string to check.
         * 
         * @return {Boolean} True if the string is compliant with `1*NQCHAR` false otherwise.
         */
        isValidOneStarNQCHAR : function(string) {
            
            // TODO
            
        },
                       
        /**
         * Function used to check if a string is compliant with `1*NQSCHAR`.
         * 
         * @param {String} string The string to check.
         * 
         * @return {Boolean} True if the string is compliant with `1*NQSCHAR`, false otherwise.
         */
        isValidOneStarNQSCHAR : function(string) {
            
            // TODO
            
        },
        
        /**
         * Function used to check if a string is compliant with `1*VSCHAR`. 
         * 
         * @param {String} string The string to check.
         * 
         * @return {Boolean} True if the string is compliant with `1*VSCHAR`, false otherwise.
         */
        isValidOneStarVSCHAR : function(string) {
      
            // TODO
            
        },
        
        /**
         * Function used to check if a string is compliant with a `response-char` (i.e compliant with 
         * `"_" / DIGIT / ALPHA`).
         * 
         * @param {String} string The string to check.
         * 
         * @return {Boolean} True if the string is compliant with a `response-char`, false otherwise.
         * @see https://tools.ietf.org/html/rfc6749#appendix-A.3
         */
        isValidResponseChar : function(string) {
            
            // TODO
            
        },
        
        /**
         * Function used to check if a string is compliant with a `response-name` (i.e compliant with `1*response-char`).
         * 
         * @param {String} string The string to check.
         * 
         * @return {Boolean} True if the string is compliant with a `response-name`, false otherwise.
         * @see https://tools.ietf.org/html/rfc6749#appendix-A.3
         */
        isValidResponseName : function(string) {
            
            // TODO
            
        },
        
        /**
         * Function used to check if a string is compliant with a `response-type` (i.e compliant with 
         * `response-name *( SP response-name )`).
         * 
         * @param {String} string The string to check.
         */
        isValidResponseType : function(string) {
            
            // TODO
            
        },
        
        /**
         * Function used to indicate if a string is compliant with a `scope` (i.e `scope-token *( SP scope-token )`). 
         * 
         * @param {String} string The string to check.
         * 
         * @return {Boolean} True if the string is compliant with a `scope`, false otherwise.
         * @see https://tools.ietf.org/html/rfc6749#appendix-A.4
         */
        isValidScope : function(string) {
            
            // TODO
            
        },
        
        /**
         * Function used to indicate if a string is compliant with a `scope-token` (i.e `1*NQCHAR`).
         * 
         * @param {String} string The string to check.
         * 
         * @return {Boolean} True if the string is compliant with a `scope-token`, false otherwise.
         * @see https://tools.ietf.org/html/rfc6749#appendix-A.4
         */
        isValidScopeToken : function(string) {
            
            return this.isValidOneStarNQCHAR(string);
            
        },
                       
        /**
         * Function used to check if a string is compliant with `*NQCHAR`. 
         * 
         * @param {String} string The string to check.
         * 
         * @return {Boolean} True if the string is compliant with `*NQCHAR`, false otherwise.
         */
        isValidStarNQCHAR : function(string) {
    
            // TODO
    
        },
        
        /**
         * Function used to check if a string is compliant with `*UNICODECHARNOCRLF`. 
         * 
         * @param {String} string The string to check.
         * 
         * @return {Boolean} True if the string is compliant with `*UNICODECHARNOCRLF`, false otherwise.
         */
        isValidStarUNICODECHARNOCRLF : function(string) {
            
            // TODO
            
        },
        
        /**
         * Fuction used to check if a string is compliant with a `token-type` (i.e compliant with 
         * `type-name / URI-reference`).
         * 
         * @param {String} string The string to check.
         * 
         * @return {Boolean} True if the string is compliant with a `token-type`, false otherwise.
         */
        isValidTokenType : function(string) {
            
            // TODO
            
        },
        
        /**
         * Function used to check if a string is compliant with a `type-name` (i.e compliant with `1*name-char`).
         * 
         * @param {String} string The string to check.
         * 
         * @return {Boolean} True if the string is compliant with a `type-name, false otherwise.
         */
        isValidTypeName : function(string) {
            
            // TODO
            
        },
        
        /**
         * Function used to check if a string is compliant with `URI-reference`. 
         * 
         * @param {String} string The string to check.
         * 
         * @return {Boolean} True if the string is compliant with `URI-reference`, false otherwise.
         */
        isValidURIReference : function(string) {
            
            // TODO
            
        }
    
        
                       
    };
    /**
     * Class which represents an Authentication Status, an authentication status describes the authentication state of the 
     * user using an app.
     * 
     * @author Baptiste GAILLARD (baptiste.gaillard@gomoob.com)
     * @class AuthStatus
     * @memberof OAuth
     */
    OAuth.AuthStatus = function(settings) {
    
        // TODO: Il faut maintenant que le storage manager persiste un AuthStatus
    
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
        
        // TODO: A documenter, je pense qu'on peut faire que cette fonction retourne toujours quelque chose même si le 
        //       status n'est pas créé suite à une requête sur le Token Endpoint. Dans ce cas indiquer dans la 
        //       docummentation des Access Token Response que le champs 'xhr' est "fictif" si la réponse est construite 
        //       depuis un storage...   
        /**
         * Gets the Access Token Response object which was used to create this AuthStatus object. In most cases this Access 
         * Token Response object is only useful by the developer to inspect error responses. Successful responses are useful 
         * internally but the developer can only call the {@link #isConnected()} function.
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
                accessTokenResponse : _accessTokenResponse.toJSON()
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
        
        // A valid access token response object is mandatory
        if(typeof settings.accessTokenResponse !== 'object') {
            
            throw new Error(
                'The settings object has not access token response object or an invalid access token response object !'
            );
    
        }
        
        _status = settings.status;
        _accessTokenResponse = settings.accessTokenResponse;
    
    };
    /**
     * Class used to provide function utilities.
     * 
     * @author Baptiste GAILLARD (baptiste.gaillard@gomoob.com)
     * @class FunctionUtils
     * @memberof OAuth
     */
    OAuth.FunctionUtils = {
                       
        /**
         * Bind a function to an object, meaning that whenever the function is called, the value of this will be the object. 
         * Optionally, pass arguments to the function to pre-fill them, also known as partial application.
         * 
         * NOTE: This function is the same as the Underscore JS '_.bind(func, context)' function.
         * 
         * @param func The function to bind.
         * @param context The context object.
         * 
         * @returns The bound function.
         * 
         * @see http://documentcloud.github.io/underscore/docs/underscore.html#section-63
         */
        bind : function(func, context) {
    
            // @see http://documentcloud.github.io/underscore/docs/underscore.html#section-62
            // @see http://documentcloud.github.io/underscore/docs/underscore.html#section-9 
            var ctor = function(){},
                slice = Array.prototype.slice, 
                nativeBind = Function.prototype.bind;
    
            // Do not modify this peace of code because its a pure copy of Underscore JS '_.bind(func, context)'
            // @see http://documentcloud.github.io/underscore/docs/underscore.html#section-63
            /* jshint ignore:start */
            var args, bound;
            if (nativeBind && func.bind === nativeBind) { return nativeBind.apply(func, slice.call(arguments, 1)); }
            if (typeof func !== 'function') throw new TypeError;
            args = slice.call(arguments, 2);
            return bound = function() {
              if (!(this instanceof bound)) return func.apply(context, args.concat(slice.call(arguments)));
              ctor.prototype = func.prototype;
              var self = new ctor;
              ctor.prototype = null;
              var result = func.apply(self, args.concat(slice.call(arguments)));
              if (Object(result) === result) return result;
              return self;
            };
            /* jshint ignore:end */
    
        }
                           
    };
    
    /**
     * Class which represents a Login Context, a login context is an object which transports informations to login to a 
     * server.
     * 
     * @author Baptiste GAILLARD (baptiste.gaillard@gomoob.com)
     * @class LoginContext
     * @memberof OAuth
     */
    OAuth.LoginContext = function() {
    
        /**
         * The credentials provided.
         * 
         * @var {Object}
         */
        this._credentials = null;
        
        /**
         * A reference to the callback function passed to the `OAuth.login(cb, opts)` method.
         * 
         * @var {LoginContext~loginCb}
         */
        this._loginCb = null;
        
        this._loginFnCb = null;
        
        this._loginFnOpts = null;
        
        /**
         * A reference to the options passed to the `OAuth.login(cb, opts)` method.
         * 
         * @var {Object}
         */
        this._loginOpts = null;
    
        /**
         * A reference to the OAuth.JS Request Manager which created this Login Context object.
         * 
         * @var {OAuth.RequestManager}
         */
        this._requestManager = null;
        
    };
    
    OAuth.LoginContext.prototype = {
    
        /**
         * Gets the last credentials provided.
         * 
         * @return {Object} The last credentials provided.
         */
        getCredentials : function() {
            
            return this._credentials;
            
        },
        
        /**
         * Gets a reference to the callback function passed to the `OAuth.login(loginCb, opts)` method.
         * 
         * @returns {LoginContext~loginCb} loginCb A reference to the callback function passed to the 
         *          `OAuth.login(cb, opts)` method.
         */
        getLoginCb : function() {
            
            return this._loginCb;
            
        },
        
        getLoginFnCb : function() {
            
            return this._loginFnCb;
            
        },
                                          
        /**
         * Function to call to send credentials to an OAuth 2.0 server.
         * 
         * @param {Object} credentials 
         * @param {LoginContext~loginFnCb}
         * @param {Object} loginFnOpts
         */
        sendCredentials : function(credentials, loginFnCb, loginFnOpts) {
    
            // Backups the provided credentials, login function callback and login function options. This is important 
            // because those information can then be used by the request manager
            this._credentials = credentials;
            this._loginFnCb = loginFnCb;
            this._loginFnOpts = loginFnOpts;
            
            // Sends the credentials with OAuth.JS
            // TODO: Ici il serait beaucoup plus propre de lever un événement intercepté par le Request Manager pour ne pas 
            //       avoir de dépendance vers le Request Manager
            this._requestManager._login(this, credentials, loginFnCb);
    
        }, 
        
        /**
         * Sets a reference to the callback function passed to the `OAuth.login(cb, opts)` method.
         * 
         * @param {LoginContext~loginCb} loginCb A reference to the callback function passed to the 
         *        `OAuth.login(cb, opts)` method.
         */
        _setLoginCb : function(loginCb) {
            
            this._loginCb = loginCb;
            
        },
        
        /**
         * Sets a reference to the options passed to the `OAuth.login(cb, opts)` method.
         * 
         * @param {Object} loginOpts A reference to the options passed to the `OAuth.login(cb, opts)` method.
         */
        _setLoginOpts : function(loginOpts) {
            
            this._loginOpts = loginOpts;
    
        },
        
        /**
         * Sets the Request Manager which created this Login Context.
         * 
         * @param {OAuth.RequestManager} requestManager The Request Manager which created this Login Context.
         */
        _setRequestManager : function(requestManager) {
            
            this._requestManager = requestManager;
            
        }
                                     
    };
    
    /**
     * Class which "simulates" an ES6 promise, this class is only used internally and does not implement all aspects of ES6 
     * promises. In fact its a very naive implementation, so DO NEVER use this class and believe its behavior is the same as 
     * ES6 promises !
     * 
     * @author Baptiste GAILLARD (baptiste.gaillard@gomoob.com)
     * @class Promise
     * @memberof OAuth
     * @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise
     */
    OAuth.Promise = function(executor) {
        
        /**
         * An array of fullfillment listeners to be called when the promise is fullfilled.
         * 
         * @instance
         * @private
         * @type {Array}
         */
        _fullfillmentListeners = [];
        
        /**
         * An array of rejection listeners to be called when the promise is rejected.
         * 
         * @instance
         * @private
         * @type {Array}
         */
        _rejectionListeners = [];
        
        /**
         * The current state of the promise, available values are : 
         *  * `pending`   : initial state, not fulfilled or rejected.
         *  * `fulfilled` : successful operation
         *  * `rejected`  : failed operation.
         *  * `settled`   : the Promise is either fulfilled or rejected, but not pending.
         *  
         * @instance
         * @private
         * @type {String}
         */
        _state = 'pending';
        
        // Ensure the executor is a function
        if(typeof executor !== 'function') {
            
            throw new Error('You must provide an executor function !');
            
        }
        
        executor(
            function(value) {
                
                // We resolve the promise only if its state is equal to 'pending'
                if(_state === 'pending') {
                
                    // Marks the promise as 'fullfilled'
                    _state = 'fullfilled';
                    
                    // Call all the fullfillment listeners
                    for(var i = 0; i < _fullfillmentListeners.length; ++i) {
        
                        _fullfillmentListeners[i](value);
        
                    }
                }
    
            },
            function(value) {
    
                // We reject the promise only if its state is equal to 'pending'
                if(_state === 'pending') {
                
                    // Marks the promise as 'rejected'
                    _state = 'rejected';
                    
                    // Call all the rejection listeners
                    for(var i = 0; i < _rejectionListeners.length; ++i) {
        
                        _rejectionListeners[i](value);
        
                    }
                    
                }
                
            }
        );
        
        /**
         * The then() method returns a Promise. It takes two arguments, both are callback functions for the success and 
         * failure cases of the Promise.
         * 
         * @param {Function} onFulfilled A Function called when the Promise is fulfilled. This function has one argument, 
         *        the fulfillment value.
         * @param {Function} onRejected A Function called when the Promise is rejected. This function has one argument, the 
         *        rejection reason.
         *        
         * @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise/then
         */
        this.then = function(onFulfilled, onRejected) {
            
            _fullfillmentListeners.push(onFulfilled);
            _rejectionListeners.push(onRejected);
            
            return this;
            
        };
        
    };
    /**
     * Component used to manage persistance of a user connection state on client side.
     * 
     * @author Baptiste GAILLARD (baptiste.gaillard@gomoob.com)
     */
    OAuth.StorageManager = function(configuration) {
    
        /**
         * A component used to parse server responses to requests on the OAuth 2.0 Token Endpoint.
         * 
         * @instance
         * @private
         * @type {OAuth.AccessToken.ResponseParser}
         */
        this._accessTokenResponseParser = new OAuth.AccessToken.ResponseParser();
        
        /**
         * The storage used to store the Access Token Response, 2 kinds of storage are supported. 
         * 
         *  * 'local'   : To use the browser local storage.
         *  * 'session' : To use the browser session storage.
         *  
         * @property {Storage}
         */
        this._storage = localStorage;
        
        /**
         * The key used to store the Access Token Response inside the Web Storage.
         * 
         * @param {String}
         */
        this._storageKey = 'oauth.js';
    
        // If no Web Storage is available in the browser
        if(typeof Storage === 'undefined') {
    
            throw new Error('Your browser does not support HTML5 Web Storage !');
    
        }
        
        // If a specific configuration is provided
        if(typeof configuration === 'object') {
         
            // Configure the storage to use
            switch(configuration.storage) {
                case 'local':
                case null:
                case undefined:
                    this._storage = localStorage;
                    break;
                case 'session':
                    this._storage = sessionStorage;
                    break;
                default:
                    throw new Error('Invalid storage value provided !');
            }
            
            // Configure the storage key
            this._storageKey = typeof configuration.storageKey === 'string' ? configuration.storageKey : 'oauth.js';
    
        }
        
    };
    
    OAuth.StorageManager.prototype = {
    
        /**
         * Clear all the informations stored using this storage manage.
         */
        clear : function() {
            
            this._storage.removeItem(this._storageKey + '.accessTokenResponse');
            
        },
                                      
        /**
         * Gets the last Access Token stored.
         * 
         * @return {String} The last Access Token stored or null if no Access Token is stored.
         */
        getAccessToken : function() {
            
            var accessTokenResponse = this.getAccessTokenResponse(), 
                accessToken = accessTokenResponse !== null ? accessTokenResponse.access_token : null;
            
            // Returns null or a valid token (undefined is always converted to null)
            return accessToken === null || accessToken === undefined ? null : accessToken;
    
        },
    
        /**
         * Gets the last Access Token Response stored.
         * 
         * @param {AccessTokenResponse} The last Access Token Response stored. 
         */
        getAccessTokenResponse : function() {
            
            var rawAccessTokenResponse = this._storage.getItem(this._storageKey + '.accessTokenResponse');
    
            return rawAccessTokenResponse !== null ? JSON.parse(rawAccessTokenResponse) : null;
    
        },
    
        /**
         * Gets the last Refresh Token stored.
         * 
         * @return {String} The last Refresh Token stored.
         */
        getRefreshToken : function() {
    
            var accessTokenResponse = this.getAccessTokenResponse(), 
                refreshToken = accessTokenResponse !== null ? accessTokenResponse.refresh_token : null;
    
            // Returns null or a valid token (undefined is always converted to null)
            return refreshToken === null || refreshToken === undefined ? null : refreshToken;
    
        },
    
        /**
         * Persists the Raw Access Token Response.
         * 
         * @param {String} rawAccessTokenResponse The raw Access Token Response returned from the server, this must be a raw 
         *        string.
         */
        persistRawAccessTokenResponse : function(rawAccessTokenResponse) {
    
            // TODO: Valider la réponse...
    
            this._storage.setItem(this._storageKey + '.accessTokenResponse', rawAccessTokenResponse);
    
        },
        
        /**
         * Function used to persist an Access Token Response from a specified {@link XMLHttpRequest} object. 
         * 
         * @param {XMLHttpRequest} xhr An {@link XMLHttpRequest} object which was used to send a POST HTTP request to an 
         *        OAuth 2.0 Token Endpoint.
         *        
         * @return {OAuth.AuthStatus} A resulting {@link OAuth.Status} object which describe the user connection state which 
         *         has been persisted on the storage.
         */
        persistAccessTokenResponse : function(xhr) {
            
            // The 'xhr' parameter must be an object
            if(typeof xhr !== 'object') {
                
                throw new Error(
                    'The provided XHMLHttpRequest object is invalid !'
                );
                
            }
            
            // The XMLHttpRequest object must be in the 'DONE' state
            if(xhr.readyState !== xhr.DONE) {
    
                throw new Error(
                    'The provided XHMLHttpRequest object must be in the DONE state before used for persistance !'
                );
    
            }
            
            var accessTokenResponse = null, 
                authStatus = null;
            
            // Parse the Access Token Response
            accessTokenResponse = this._accessTokenResponseParser.parse(xhr);
            
            // Creates the AuthStatus object
            authStatus = new OAuth.AuthStatus(
                {
                    status : accessTokenResponse.isSuccessful() ? 'connected' : 'disconnected',
                    accessTokenResponse : accessTokenResponse
                }
            );
            
            // Persists the new AuthStatus object
            this._storage.setItem(this._storageKey + '.authStatus', authStatus.toString());
    
            return authStatus;
    
        }
        
    };
    /**
     * Utility class used to manipulate URLs.
     * 
     * @author Baptiste GAILLARD (baptiste.gaillard@gomoob.com)
     * @class UrlUtils
     * @memberof OAuth
     */
    OAuth.UrlUtils = {
    
        /**
         * Utility function used to append an argument to a URL, if the argument is already present in the URL this argument
         * value is updated with the new argument value.
         * 
         * @param {String} url The string into which one to add an argument.
         * @param {String} name The name of the argument to add.
         * @param {String} value The value of the argument to add.
         * 
         * @param {String} The URL with the added argument.
         */
        addArgument : function(url, name, value) {
            
            var updatedUrl = url, 
                nameEqual = name + '=',
                argumentPos = url.indexOf(nameEqual);
            
            // If the provided URL has already parameters
            if(url.indexOf('?') !== -1) {
                
                // If the provided URL already has the argument
                if(argumentPos !== -1) {
                    
                    // Creates a URL prefix 'http://a.b.com?a=1&b=2&name=' and a URL suffix 'value=xxx&c=3&d=4'
                    var prefix = updatedUrl.substring(0, argumentPos + nameEqual.length), 
                        suffix = updatedUrl.substring(prefix.length), 
                        nextArgumentPos = suffix.indexOf('&');
                    
                    // Their is no additional argument in the suffix so we can safely rebuild the URL with the new argument 
                    // value
                    if(nextArgumentPos === -1) {
                        
                        updatedUrl = prefix + value;
                        
                    } 
                    
                    // Otherwise we remove the old argument value from the suffix and rebuild the URL with the new argument 
                    // value
                    else {
                        
                        suffix = suffix.substring(nextArgumentPos);
                        updatedUrl = prefix + value + suffix;
    
                    }
                    
                } 
                
                // Otherwise we can safely add the URL argument at the end of the URL
                else {
                    
                    updatedUrl = updatedUrl + '&' + nameEqual + value;    
                    
                }
            } 
            
            // Otherwise we can safely add the URL argument
            else {
                
                updatedUrl = updatedUrl + '?' + nameEqual + value;
    
            }
    
            return updatedUrl;
    
        },
        
        /**
         * Utility function used to convert an object to a Query string.
         * 
         * @param {Object} object The javascript object to convert.
         * 
         * @return {String} The resulting query string
         */
        toQueryString : function(object) {
            
            var queryString = '';
            
            // The provided argument must be an object
            if(typeof object !== 'object') {
    
                throw new Error('The provided argument must be an object !');
                
            }
            
            for(var key in object) {
                
                if(queryString.length > 0) {
                    
                    queryString += '&';
                    
                }
                
                queryString += key;
                queryString += '=';
                queryString += object[key];
                
            }
            
            return queryString;
            
        }
                      
    };
    
    /**
     * Utility class used to manipulate {@link XMLHttpRequest} objects.
     * 
     * @author Baptiste GAILLARD (baptiste.gaillard@gomoob.com)
     * @class XhrUtils
     * @memberof OAuth 
     * @see http://www.w3.org/TR/XMLHttpRequest
     * @see https://github.com/ilinsky/xmlhttprequest
     */
    OAuth.XhrUtils = {
    
        /**
         * Function used to create a JSON representation of an {@link XMLHttpRequest}, the created JSON representation allow 
         * to backhup the state of a request somewhere (in a local storage or a cookie for exemple). Please note that the 
         * created JSON representation cannot be used to recreate the {@link XMLHttpRequest} back.
         * 
         * @param {XMLHttpRequest} xhr The {@link XMLHttpRequest} object to be converted into a JSON representation.
         * 
         * @return {Object} A javascript object which represents a JSON representation of the provided 
         *         {@link XMLHttpRequest} object.
         */
        toJSON : function(xhr) {
            
            // @see http://www.w3.org/TR/XMLHttpRequest/#interface-xmlhttprequest
            return {
                readyState : xhr.readyState,
                status : xhr.status,
                statusText : xhr.statusText,
                response : xhr.response,
                responseText : xhr.responseText,
                responseXML : xhr.responseXML
            };
    
        }
    
    };
    
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
    /**
     * Class used to represent a Critical Error OAuth 2.0 Access Token response.
     * 
     * Critial error codes ARE NOT DEFINED by the OAuth 2.0 RFC and are used by OAuth.JS when the server returned invalid 
     * responses (i.e which are not compliant with the OAuth 2.0 RFC). Critical errors have error codes which are compliant 
     * with the following template : '__oauth__js__${errorCode}__'.
     * 
     * @author Baptiste GAILLARD (baptiste.gaillard@gomoob.com)
     */
    OAuth.AccessToken.CriticalErrorResponse = function() {
        
        // The CriticalResponse extends the ErrorResponse
        OAuth.AccessToken.ErrorResponse.apply(this, arguments);
        
        // At the begining the error has a default code
        this.setError('__oauth__js__uninitialized__');
        
        ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
        // PRIVATE MEMBERS
        ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    
        ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
        // PUBLIC MEMBERS
        ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    
    };
    
    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    // STATIC MEMBERS
    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    
    /**
     * An array which stores critical error codes. Critial error codes ARE NOT DEFINED by the OAuth 2.0 RFC and are used 
     * by OAuth.JS when the server returned invalid responses (i.e which are not compliant with the OAuth 2.0 RFC). 
     * Critical errors have error codes which are compliant with the following template : '__oauth__js__${errorCode}__'.
     * 
     * @instance
     * @private
     * @type {String[]}
     */
    OAuth.AccessToken.CriticalErrorResponse.criticalErrorCodes = [
    
        // TODO: A documenter, cette documentation doit apparaître dans le JSDoc, on doit avoir une référence à la règle 
        //       des spécifications OAuth 2.0 qui est violée
        '__oauth_js__headers_bad_cache_control__',
    
        // TODO: A documenter, cette documentation doit apparaître dans le JSDoc, on doit avoir une référence à la règle 
        //       des spécifications OAuth 2.0 qui est violée
        '__oauth_js__headers_bad_media_type__',
        
        // TODO: A documenter, cette documentation doit apparaître dans le JSDoc, on doit avoir une référence à la règle 
        //       des spécifications OAuth 2.0 qui est violée
        '__oauth_js__headers_bad_pragma__',
                               
        // TODO: A documenter, cette documentation doit apparaître dans le JSDoc, on doit avoir une référence à la règle 
        //       des spécifications OAuth 2.0 qui est violée
        '__oauth_js__entity_body_invalid_json__',
        
        // TODO: A documenter, cette documentation doit apparaître dans le JSDoc, on doit avoir une référence à la règle 
        //       des spécifications OAuth 2.0 qui est violée
        '__oauth_js__entity_body_not_json__',
    
        // TODO: A documenter, cette documentation doit apparaître dans le JSDoc, on doit avoir une référence à la règle 
        //       des spécifications OAuth 2.0 qui est violée
        '__oauth_js__uninitialized__'
    
    ];
    
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
    
            return /^__oauth_js__[\w\d-_]+__$/.test(_error);
    
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
                xhr : OAuth.XhrUtils.toJSON(this.getXhr())
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
        valid = jsonResponse.hasOwnProperty('error');
        
        // The 'error' parameter MUST BE a string
        valid = valid && typeof jsonResponse.error === 'string';
        
        // As described in [Section 5.2](https://tools.ietf.org/html/rfc6749#section-5.2 "Section 5.2") of the OAuth 2.0 
        // specifications Values for the "error" parameter MUST NOT include characters outside the set 
        // %x20-21 / %x23-5B / %x5D-7E.
        // @see http://www.unicode.org/charts/PDF/U0000.pdf
        valid = valid && /^[\x20-\x21\x23-\x5B\x5D-\x7E]+$/.test(jsonResponse.error);
    
        return valid;
    
    };
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
        var valid = typeof jsonResponse === 'object';
        
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
    
    /**
     * Abstract class common to all OAuth.JS Request Managers.
     * 
     * @author Baptiste GAILLARD (baptiste.gaillard@gomoob.com)
     */
    OAuth.Request.AbstractRequestManager = function(configuration) {
        
        /**
         * A component used to parse server responses to requests on the OAuth 2.0 Token Endpoint.
         * 
         * @instance
         * @private
         * @type {OAuth.AccessToken.ResponseParser}
         */
        this._accessTokenResponseParser = new OAuth.AccessToken.ResponseParser();
    
        /**
         * The storage manager used to manage persistence of OAuth 2.0 tokens on client side.
         * 
         * @instance
         * @private
         * @type {OAuth.StorageManager}
         */
        this._storageManager = null;
        
        /**
         * The URL to the token endpoint used to retrieve an access and a refresh token.
         * 
         * @instance
         * @private
         * @type {String}
         */
        this._tokenEndpoint = null;
        
        /**
         * Function used to determine if a user is logged in to your application. 
         * 
         * @param {Function} cb TODO A DOCUMENTER
         * @returns {Boolean} forceServerCall TODO A DOCUMENTER
         */
        this.getLoginStatus = function(cb, forceServerCall) {
    
            // TODO: Pour le moment on utilise pas le tag 'forceServerCall', ce tag est défini de manière à avoir une 
            //       fonction 'getLoginStatus' très similaire à ce que défini le client Facebook FB.getLoginStatus()... Plus 
            //       tard il faudra même que la date côté client soit comparée à la date d'expiration du Token pour voir si 
            //       on considère que le client est connecté ou non...
            // TODO: Il faudrait également que l'on prévoit des événements Javascript de la même manière que ce que fait 
            //       Facebook
    
            // If no OAuth 2.0 Access Token response is stored on client side then the client is considered disconnected
            if(this._storageManager.getAccessTokenResponse() === null) {
                
                cb(
                    {
                        status : 'disconnected'    
                    }
                );
                
            } 
            
            // Otherwise the client is considered connected
            else {
            
                cb(
                    {
                        status : 'connected',
                        authResponse : this._storageManager.getAccessTokenResponse()
                    }
                );
    
            }
    
        };
        
        /**
         * Function used to logout a user.
         * 
         * @param logoutCb A callback to be called after the logout is done.
         */
        this.logout = function(logoutCb) {
          
            // Clears the storage manage by the storage manager
            this._storageManager.clear();
            
            // Calls the provided callback function
            logoutCb();
    
        };
    
    };
    
    /**
     * 
     * 
     * @author Baptiste GAILLARD (baptiste.gaillard@gomoob.com)
     */
    OAuth.Request.AngularRequestManager = function(configuration) {
        
        // The AngularRequestManager extends the AbstractRequestManager
        OAuth.Request.AbstractRequestManager.apply(this, arguments);
        
        this._$provide = configuration.$provide;
    
        /**
         * The function used to retrieve credentials to get an OAuth 2.0 Access Token.
         */
        this._loginFn = null;
    
        // If a specific configuration is provided
        if(typeof configuration === 'object') {
    
            // The login function is required
            if(typeof configuration.loginFn !== 'function') {
                
                throw new Error('No login function is provided !');
                
            }
            
            this._loginFn = configuration.loginFn;
    
            // The client id is required
            if(typeof configuration.clientId === 'undefined') {
    
                throw new Error('No client id is provided !');
    
            }
    
            this._clientId = configuration.clientId;
    
            // The token endpoint is required
            if(typeof configuration.tokenEndpoint !== 'string') {
                
                throw new Error('No token endpoint is provided or its valued is invalid !');
                
            }
            
            this._tokenEndpoint = configuration.tokenEndpoint;
    
            // The parse error function is required
            if(typeof configuration.parseErrorFn !== 'function') {
    
                throw new Error('No parse error function is provided !');
    
            } 
            
            this._parseErrorFn = configuration.parseErrorFn;
    
            // Instanciate the OAuth 2.0 Access Token response storage
            this._storageManager = new OAuth.StorageManager({
                storage : configuration.storage,
                storageKey : configuration.storageKey
            });
            
        } 
        
        // Otherwise the request manager uses a default configuration
        else {
            
            throw new Error('A configuration object is required !');
    
        }
        
    };
    OAuth.Request.AngularRequestManager.prototype = {
    
        //TODO: Ceci correspond presque à la méthode '_login' que l'on a en Backbone
        sendCredentials : function(credentials, cb, opts) {
            
            this._loginContext = new OAuth.LoginContext();
            this._loginContext._setLoginCb(cb);
            this._loginContext._setLoginOpts(opts);
            this._loginContext._setRequestManager(this);
            
            var xhr = new XMLHttpRequest();
        
            switch(credentials.grant_type) {
                case 'password':
                    
                    // @see https://github.com/ilinsky/xmlhttprequest/blob/master/XMLHttpRequest.js#L91
                    xhr.open(
                        'POST',                // Method
                        this._tokenEndpoint,   // URL
                        true                   // Async
                    );
                    
                    // @see https://github.com/ilinsky/xmlhttprequest/blob/master/XMLHttpRequest.js#L330
                    xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
                    
                    // @see https://github.com/ilinsky/xmlhttprequest/blob/master/XMLHttpRequest.js#L263
                    xhr.send(
                        OAuth.UrlUtils.toQueryString(
                            {
                                grant_type : credentials.grant_type,
                                client_id : this._clientId,
                                username : credentials.username,
                                password : credentials.password
                            }
                        )
                    );
    
                    xhr.onreadystatechange = 
                        OAuth.FunctionUtils.bind(this._onreadystatechangeTokenEndpointPost, this, xhr);
                    
                    break;
                default:
                    throw new Error('Invalid credentials \'grant_type\' provided !');
            }
            
        },
        
        /**
         * Callback function called when an HTTP POST request is sent to the configured OAuth 2.0 Token Endpoint. This 
         * function is called if the POST is successful or in error, then an Access Token Response Parser (see 
         * {@link OAuth.AccessToken.ResponseParser) is used to know if the response is successful or not. 
         * 
         * @param {XMLHttpRequest} xhr The XMLHttpRequest object used to send an HTTP POST request to the OAuth 2.0 Token 
         *        Endpoint.
         */
        _onTokenEndpointPost : function(xhr) {
    
            // TODO: Les callbacks de login sont appelés dans tous les cas, il est souvent fréquent que l'on ne souhaite pas 
            //       appeler le callback tant que le formulaire de login n'est pas rempli. Il nous faudrait une option pour 
            //       ceci. 
            
            var accessTokenResponse = null,
                authStatus = null, 
                loginCb = this._loginContext.getLoginCb(),
                loginFnCb = this._loginContext.getLoginFnCb();
    
            // Parse the Access Token Response
            accessTokenResponse = this._accessTokenResponseParser.parse(xhr);
    
            // Creates the AuthStatus object
            authStatus = new new OAuth.AuthStatus(
                {
                    status : accessTokenResponse.isSuccessful() ? 'connected' : 'disconnected',
                    accessTokenResponse : accessTokenResponse
                }
            );
    
            // Persist the new AuthStatus object (this is the action which will prevent OAuth.JS to perform other successful
            // requests)
            // TODO:
            
            // If the 'loginFn' or 'sendCredentials' function has provided a 'loginFnCb' callback we call it first, then 
            // when its called we call the login callback.  
            if(typeof loginFnCb === 'function') {
                
                var promise = new OAuth.Promise(
                    function(resolve, reject) {
                        
                        // Calls the 'loginFnCb' callback with the 'resolve' and 'reject' to allow the developer to fullfill 
                        // the promise or reject it.
                        //  - If the promise is fullfilled this indicates that the login form has been successfully filled
                        //  - If the promise is rejected this indicates that the login form has not been successfully filled
                        loginFnCb(authStatus, resolve, reject);
    
                    }
                );
                promise.then(
                    function(value) {
                        
                        // The form has been successfully filled
                        loginCb(authStatus);
    
                    }, 
                    function(reason) {
                        
                        // The form has not been successfully filled
                        loginCb(authStatus);
    
                    }
                );
    
            } 
            
            // Otherwise we call the 'login' function callback directly
            else {
    
                loginCb(authStatus);
    
            }
            
        },
        
        _onreadystatechangeTokenEndpointPost : function(xhr, slicedArguments) {
            
            // @see https://github.com/ilinsky/xmlhttprequest/blob/master/XMLHttpRequest.js#L57
            switch(xhr.readyState) {
                // UNSENT
                case 0:
                    console.log('UNSENT');
                    break;
                // OPENED
                case 1:
                    console.log('OPENED');
                    break;
                // HEADERS_RECEIVED
                case 2:
                    console.log('HEADERS_RECEIVED');
                    break;
                // LOADING
                case 3:
                    console.log('LOADING');
                    break;
                // DONE
                case 4:
                    
                    if(xhr.status >= 200 && xhr.status < 300) {
                        
                        this._onTokenEndpointPost(xhr);
                        
                    } else if(xhr.status >= 300 && xhr.status < 400) {
                        
                        console.log('DONE - 3XX');
                        
                    } else if(xhr.status >= 400 && xhr.status < 500) {
                        
                        this._onTokenEndpointPost(xhr);
                        
                    } else if(xhr.status >= 500 && xhr.status < 600) {
                        
                        console.log('DONE - 6XX');
                        
                    }
                    
                    break;
            }
        
        },
                                            
        /**
         * Function used to login a user, by default this function checks if the user is already logged in, if it is the 
         * configured 'loginFn' function is not called and the provided 'loginCb' callback is directly called. Otherwise the 
         * 'loginFn' callback function is called before calling the provided callback. 
         * 
         * @param loginCb A callback function to be called when a login action has been done.
         * @param opts Options used to configure the login.
         */
        login : function(loginCb, opts) {
        
            // Creates and configures a Login Conext which is then received by the configured 'loginFn' method and is also 
            // used in the Request Manager
            this._loginContext = new OAuth.LoginContext();
            this._loginContext._setLoginCb(loginCb);
            this._loginContext._setLoginOpts(opts);
            this._loginContext._setRequestManager(this);
            
            // If no OAuth 2.0 Access Token response is stored on client side then the client is considered disconnected
            // So in this case we call the 'loginFn' function
            if(this._storageManager.getAccessTokenResponse() === null) {
        
                // Calls the configured 'loginFn' method, this one will resolve the credentials promise by providing 
                // credentials
                this._loginFn(this._loginContext);
        
                // FIXME: Ici il serait beaucoup plus propre que la credentials promise lève un événement une fois la fin de 
                //        l'exécution de 'sendCredentials' et que le Request Manager écoute cet événement. Ainsi la 
                //        Credentials Promise n'aurait pas à dépendre du Request Manager
        
            }
            
            // Otherwise we directly call the callback.
            else {
                
                loginCb(
                    {
                        status : 'connected',
                        authResponse : this._storageManager.getAccessTokenResponse()
                    }
                );
                
            }
            
        },
                      
        _$httpGet : function() {
            
            var augmentedArguments = arguments;
            
            // TODO: Uniquement si arguments[1] est défini et arguments[1].secured est vrai...
            if(!augmentedArguments[1].params) {
                augmentedArguments[1].params = {};
            }
            
            // Try to get an OAuth 2.0 Access Token from the client storage
            var accessToken = this._storageManager.getAccessToken();
            
            // Appends the 'access_token' URL parameter
            if(accessToken) {
    
                augmentedArguments[1].params.access_token = accessToken;
                
            }
            
    
            return this._$http.get.apply(this._$http, augmentedArguments);
            
        },
        
        /**
         * Start the AngularJS Request Manager, the purpose of the start method is to overwrites the Angular JS HTTP service 
         * to manage OAuth 2.0 Access Token operations transparently.
         */
        start : function() {
            
            var This = this;
            
            this._$provide.decorator(
                '$http', 
                function($delegate) {
                
                    This._$http = $delegate;
                    
                    var wrapper = function() {
                    
                        return This._$http.apply(This._$http, arguments);
    
                    };
    
                    // TODO: Faire une surcharge complète...
                    wrapper.get = OAuth.FunctionUtils.bind(This._$httpGet, This);
    
                    return wrapper;
                    
                }
            );
            
    /*        
            // Backup the original XHMLHttpRequest 'open' method to reuse it
            this._backupedOpen = XMLHttpRequest.prototype.open;
        
            // Change the reference to the HTMLHttpRequest 'open' method to use the OAuth.JS custom 'open' method 
            // instead            
            XMLHttpRequest.prototype.open = function() {
                
                // Remove the 'callee', 'caller', 'set_callee', 'get_collee', 'set_caller' and 'get_caller' methods
                // This is because the special 'arguments' Javascript object is not an array
                // @see https://developer.mozilla.org/docs/Web/JavaScript/Reference/Fonctions/arguments
                var slicedArguments = [].slice.call(arguments);
                
                // Calls the OAuth.JS 'open' method
                return This._open(this, slicedArguments);
                
            };
    */
    
        },
        
        _open : function(xhr, slicedArguments) {
            
            // We ensure that if the provided arguments are modified somewhere in the code this has no impact on the 
            // standard XMLHttpRequest behavior. So we clone the original HTMLHttpRequest arguments before working with 
            // them.
            var clonedOpenArguments = this._cloneOpenArguments(slicedArguments);
            
            // Augment the original XMLHttpRequest arguments by adding arguments specific to OAuth 2.0 / OAuth.JS
            var augmentedOpenArguments = this._augmentOpenArguments(clonedOpenArguments);
            
            xhr.onreadystatechange = function() {
                
                // @see https://github.com/ilinsky/xmlhttprequest/blob/master/XMLHttpRequest.js#L57
                switch(this.readyState) {
                    // UNSENT
                    case 0:
                        console.log('UNSENT');
                        break;
                    // OPENED
                    case 1:
                        console.log('OPENED');
                        break;
                    // HEADERS_RECEIVED
                    case 2:
                        console.log('HEADERS_RECEIVED');
                        break;
                    // LOADING
                    case 3:
                        console.log('LOADING');
                        break;
                    // DONE
                    case 4:
                        console.log('DONE');
                        break;
                }
                
            };
        
            console.log('Tada !');
            console.log(arguments);
            console.log([].slice.call(arguments));
            
            return this._backupedOpen.apply(xhr, slicedArguments);
            
        },
        
        _cloneOpenArguments : function(slicedArguments) {
            
            // TODO: Méthode à implémenter
            return slicedArguments;
            
        },
        
        _augmentOpenArguments : function(openArguments) {
            
            // Try to get an OAuth 2.0 Access Token from the client storage
            var accessToken = this._storageManager.getAccessToken();
            
            // Appends the 'access_token' URL parameter
            if(accessToken) {
        
                // TODO: A implémenter...
                
            }
        
        },
        
        /**
         * Function called after a 'loginFn' function is called and the 'LoginContext.sendCredentials' is called. 
         * 
         * @param loginCb A callback function to be called when a login action has been done, please note that this callback 
         *        is the one passed to 'OAuth.login(loginCb)' and is note the one passed to the 'loginFn'. 
         */
        _login : function(loginContext) {
        
            // FIXME: Normalement ici les 2 objet sont toujours égaux !!!
            this._loginContext = loginContext;
            
            var ajaxPromise = null, 
                credentials = this._loginContext.getCredentials();
        
            console.log(credentials);
            
        /*            
            if(credentials.grant_type === 'password') {
            
                ajaxPromise = $.ajax(
                    {
                        contentType : 'application/x-www-form-urlencoded; charset=UTF-8',
                        data : {
                            grant_type : credentials.grant_type,
                            client_id : this._clientId,
                            username : credentials.username,
                            password : credentials.password
                        },
                        type : 'POST',
                        url: this._tokenEndpoint        
                    }
                );
                
            } else if(credentials.grant_type === 'gomoob_facebook_access_token') {
                
                ajaxPromise = $.ajax(
                    {
                        contentType : 'application/x-www-form-urlencoded; charset=UTF-8',
                        data : {
                            grant_type : credentials.grant_type,
                            client_id : this._clientId,
                            facebook_access_token : credentials.facebook_access_token,
                            facebook_app_scoped_user_id : credentials.facebook_app_scoped_user_id
                        },
                        type : 'POST',
                        url: this._tokenEndpoint        
                    }
                );
                
            } else {
                
                throw new Error('Unknown \'grant_type\' = \'' + credentials.grant_type + '\' !');
                
            }
            
            // TODO: Message d'erreur clair si 'grant_type' non supporté...
        
            ajaxPromise.done($.proxy(this._onTokenEndpointPost, this));
            ajaxPromise.fail($.proxy(this._onTokenEndpointPost, this));
        */
        },
    
    };
    
    /**
     *
     * @author Baptiste GAILLARD (baptiste.gaillard@gomoob.com)
     */ 
    OAuth.Request.BackboneRequestManager = function(configuration) {
    
        // The BackboneRequestManager extends the AbstractRequestManager
        OAuth.Request.AbstractRequestManager.apply(this, arguments);
        
        /**
         * A reference to the original `Backbone.ajax` method.
         */
        this._backupedBackboneDotAjax = null;
        
        this._loginContext = null;
        
        /**
         * A string which identify the type of client this request manager is overwriting.
         */
        this._clientType = 'backbone';
        
        /**
         * The function used to retrieve credentials to get an OAuth 2.0 Access Token.
         */
        this._loginFn = null;
    
        /**
         * The function used to parse errors returned by the Web Services.
         */
        this._parseErrorFn = null;
    
        /**
         * The OAuth 2.0 'client_id' to use.
         */
        this._clientId = null;
    
        // Backup the global 'Backbone.ajax' method
        if(typeof Backbone !== 'undefined' && Backbone !== null) {
            
            // The existing 'Backbone.ajax' method must exist and being valid
            if(typeof Backbone.ajax !== 'function') {
                
                throw new Error('No valid \'Backbone.ajax\' method has been found !');
                
            }
            
            this._backupedBackboneDotAjax = Backbone.ajax;
    
        } 
        
        // If no global Backbone is available and no 'Backbone.ajax' method is provided this is an error
        else {
            
            throw new Error('Backbone is not available !');
            
        }
    
        // If a specific configuration is provided
        if(typeof configuration === 'object') {
    
            // The login function is required
            if(typeof configuration.loginFn !== 'function') {
                
                throw new Error('No login function is provided !');
                
            }
            
            this._loginFn = configuration.loginFn;
    
            // The client id is required
            if(typeof configuration.clientId === 'undefined') {
    
                throw new Error('No client id is provided !');
    
            }
    
            this._clientId = configuration.clientId;
    
            // The token endpoint is required
            if(typeof configuration.tokenEndpoint !== 'string') {
                
                throw new Error('No token endpoint is provided or its valued is invalid !');
                
            }
            
            this._tokenEndpoint = configuration.tokenEndpoint;
    
            // The parse error function is required
            if(typeof configuration.parseErrorFn !== 'function') {
    
                throw new Error('No parse error function is provided !');
    
            } 
            
            this._parseErrorFn = configuration.parseErrorFn;
    
            // Instanciate the OAuth 2.0 Access Token response storage
            this._storageManager = new OAuth.StorageManager({
                storage : configuration.storage,
                storageKey : configuration.storageKey
            });
            
        } 
        
        // Otherwise the request manager uses a default configuration
        else {
            
            throw new Error('A configuration object is required !');
    
        }
    };
    
    OAuth.Request.BackboneRequestManager.prototype = {
    
        /**
         * Gets the storage manager linked to this request manager.
         * 
         * @returns {StorageManager} The storage manager linked to this request manager.
         */
        getStorageManager : function() {
    
            return this._storageManager;
    
        },
    
        /**
         * Function called when a POST request has been sent on the OAuth 2.0 Token Endpoint and the server returned an
         * error response.
         * 
         * @param jqXHR The jQuery XHR object used to execute the HTTP POST request on the OAuth 2.0 Token endpoint.
         * @param textStatus A string categorizing the status of the request, this is always equal to "success" here.
         * @param errorThrown The textual portion of the HTTP status, such as "Not Found" or "Internal Server Error."
         */
        _onTokenEndpointPostError : function(jqXHR, textStatus, errorThrown) {
    
            var loginCb = this._loginContext.getLoginCb(),
                loginFnCb = this._loginContext.getLoginFnCb();
            
            // TODO: On doit gérer le cas ou le serveur retourne une réponse qui ne correspond pas du tout au format 
            //       spécifié par OAuth 2.0.
    
            // If the 'loginFn' function has provided a callback 'loginFnCb' callback
            if(typeof loginFnCb === 'function') {
            
                var deferred = $.Deferred();
    
                loginFnCb(
                    {
                        status : jqXHR.responseJSON.error,
                        authResponse : jqXHR.responseJSON
                    },
                    function() { deferred.resolve(); }
                );
                
                // When the callback function has ended
                deferred.done(function() {
    
                    loginCb(
                        {
                            status : jqXHR.responseJSON.error,
                            authResponse : jqXHR.responseJSON
                        }
                    );
    
                });
    
            } 
            
            // Otherwise we call the 'login' function callback directly
            else {
    
                loginCb(
                    {
                        status : jqXHR.responseJSON.error,
                        authResponse : jqXHR.responseJSON
                    }
                );
    
            }
    
        },
        
        /**
         * Function called when a POST request has been sent on the OAuth 2.0 Token Endpoint and the server returned a 
         * successful response.
         * 
         * @param data The raw data received from server side after posting informations to the OAuth 2.0 Token endpoint.
         * @param textStatus A string categorizing the status of the request, this is always equal to "success" here.
         * @param jqXHR The jQuery XHR object used to execute the HTTP POST request on the OAuth 2.0 Token endpoint.
         */
        _onTokenEndpointPostSuccess : function(data, textStatus, jqXHR) {
            
            var loginCb = this._loginContext.getLoginCb(),
                loginFnCb = this._loginContext.getLoginFnCb();
            
            // TODO: Ici on suppose qu'une réponse HTTP OK du serveur est forcément bonne, hors ce n'est pas forcément le 
            //       cas. On devrait vérifier ici que la réponse est compatible avec le standard OAuth 2.0.
    
            // Store the refreshed OAuth 2.0 in the local storage
            // WARNING: Please not that besides the standard OAuth 2.0 Access Token informations the 
            //          response also contain a 'user_id' field which is specific to the project and 
            //          contains the technical identifier of the user on the platform
            this._storageManager.persistRawAccessTokenResponse(JSON.stringify(data));
            
            // If the 'loginFn' function has provided a callback to be called after a successful OAuth 2.0 Access Token 
            // retrieval we call it
            if(typeof loginFnCb === 'function') {
            
                var deferred = $.Deferred();
    
                loginFnCb(
                    {
                        status : 'connected',
                        authResponse : data
                    },
                    function() { deferred.resolve(); }
                );
                
                // When the callback function has ended
                deferred.done(function() {
    
                    loginCb(
                        {
                            status : 'connected',
                            authResponse : data
                        }
                    );
    
                });
    
            } 
            
            // Otherwise we call the 'login' function callback directly
            else {
    
                loginCb(
                    {
                        status : 'connected',
                        authResponse : data
                    }
                );
    
            }
            
        },
    
        /**
         * Function called after a 'loginFn' function is called and the 'LoginContext.sendCredentials' is called. 
         * 
         * @param loginCb A callback function to be called when a login action has been done, please note that this callback 
         *        is the one passed to 'OAuth.login(loginCb)' and is note the one passed to the 'loginFn'. 
         */
        _login : function(loginContext) {
    
            // FIXME: Normalement ici les 2 objet sont toujours égaux !!!
            this._loginContext = loginContext;
            
            var ajaxPromise = null, 
                credentials = this._loginContext.getCredentials();
            
            if(credentials.grant_type === 'password') {
            
                ajaxPromise = $.ajax(
                    {
                        contentType : 'application/x-www-form-urlencoded; charset=UTF-8',
                        data : {
                            grant_type : credentials.grant_type,
                            client_id : this._clientId,
                            username : credentials.username,
                            password : credentials.password
                        },
                        type : 'POST',
                        url: this._tokenEndpoint        
                    }
                );
                
            } else if(credentials.grant_type === 'gomoob_facebook_access_token') {
                
                ajaxPromise = $.ajax(
                    {
                        contentType : 'application/x-www-form-urlencoded; charset=UTF-8',
                        data : {
                            grant_type : credentials.grant_type,
                            client_id : this._clientId,
                            facebook_access_token : credentials.facebook_access_token,
                            facebook_app_scoped_user_id : credentials.facebook_app_scoped_user_id
                        },
                        type : 'POST',
                        url: this._tokenEndpoint        
                    }
                );
                
            } else {
                
                throw new Error('Unknown \'grant_type\' = \'' + credentials.grant_type + '\' !');
                
            }
            
            // TODO: Message d'erreur clair si 'grant_type' non supporté...
    
            ajaxPromise.done($.proxy(this._onTokenEndpointPostSuccess, this));
            ajaxPromise.fail($.proxy(this._onTokenEndpointPostError, this));
    
        },
        
        /**
         * Function used to login a user, by default this function checks if the user is already logged in, if it is the 
         * configured 'loginFn' function is not called and the provided 'loginCb' callback is directly called. Otherwise the 
         * 'loginFn' callback function is called before calling the provided callback. 
         * 
         * @param loginCb A callback function to be called when a login action has been done.
         * @param opts Options used to configure the login.
         */
        login : function(loginCb, opts) {
    
            // Creates and configures a Login Conext which is then received by the configured 'loginFn' method and is also 
            // used in the Request Manager
            this._loginContext = new OAuth.LoginContext();
            this._loginContext._setLoginCb(loginCb);
            this._loginContext._setLoginOpts(opts);
            this._loginContext._setRequestManager(this);
            
            // If no OAuth 2.0 Access Token response is stored on client side then the client is considered disconnected
            // So in this case we call the 'loginFn' function
            if(this._storageManager.getAccessTokenResponse() === null) {
    
                // Calls the configured 'loginFn' method, this one will resolve the credentials promise by providing 
                // credentials
                this._loginFn(this._loginContext);
    
                // FIXME: Ici il serait beaucoup plus propre que la credentials promise lève un événement une fois la fin de 
                //        l'exécution de 'sendCredentials' et que le Request Manager écoute cet événement. Ainsi la 
                //        Credentials Promise n'aurait pas à dépendre du Request Manager
    
            }
            
            // Otherwise we directly call the callback.
            else {
                
                loginCb(
                    {
                        status : 'connected',
                        authResponse : this._storageManager.getAccessTokenResponse()
                    }
                );
                
            }
            
        },
    
        /**
         * Starts the request manager.
         */
        start : function() {
            
            // Closure used to change the context of the overwritten Backbone.ajax function to that it can access the 
            // attributes and methods of this request manager
            var This = this;
            
            // Overwrites the 'Backbone.ajax' method 
            Backbone.ajax = function() { 
                
                return This._overwrittenBackboneDotAjax.apply(This, arguments);
    
            };
    
        },
        
        /**
         * Utility function used to clone arguments passed to the jQuery 'ajax' function. Here arguments is the special 
         * Javascript variable which corresponds to the arguments passed to the 'ajax' method inside this method.
         * 
         * @param {array} ajaxArguments The jQuery 'ajax' arguments to clone.
         * 
         * @returns {array} The cloned jQuery 'ajax' arguments.
         * 
         * @see https://developer.mozilla.org/fr/docs/Web/JavaScript/Reference/Fonctions/arguments
         */
        _cloneAjaxArguments : function(ajaxArguments) {
    
            var clonedAjaxArguments = {};
            
            // The jQuery 'ajax' method has been called with a URL string as first argument
            if(typeof ajaxArguments[0] === 'string') {
                
                clonedAjaxArguments[0] = ajaxArguments[0];
                
                if(clonedAjaxArguments.length === 2) {
                    
                    clonedAjaxArguments[1] = this._cloneAjaxSettings(ajaxArguments[1]);
    
                }
                
            } 
            
            // The jQuery 'ajax' method has been called with a settings object as first argument
            else {
            
                clonedAjaxArguments[0] = this._cloneAjaxSettings(ajaxArguments[0]);
                
            }
                
            return clonedAjaxArguments;
            
        },
    
        /**
         * Utility function used to clone the settings object as a parameter of the jQuery 'ajax' method. This allow to keep 
         * an untouched settings object before modifying it to configure it with an OAuth 2.0 Access Token.
         * 
         * @param {Object} ajaxSettings The jQuery 'ajax' settings object to clone.
         * 
         * @returns {Object} The resulting clone object.
         * 
         * @see http://api.jquery.com/jQuery.ajax
         */
        _cloneAjaxSettings : function(ajaxSettings) {
            
            // see http://api.jquery.com/jQuery.ajax to know what are the names of the properties allowed by the jQuery 
            // 'ajax' settings object
            var settingsAttributes = [
                'accepts',
                'async',
                'beforeSend',
                'cache',
                'complete',
                'contents',
                'contentType',
                'context',
                'converters',
                'crossDomain',
                'data',
                'dataFilter',
                'dataType',
                'error',
                'global',
                'headers',
                'isModified',
                'isLocal',
                'jsonp',
                'jsonpCallback',
                'mimeType',
                'password',
                'processData',
                'scriptCharset',
                'statusCode',
                'success',
                'timeout',
                'traditional',
                'type',
                'url',
                'username',
                'xhr',
                'xhrFields'
            ];
            
            var clonedAjaxSettings = {};
            
            for(var i = 0; i < settingsAttributes.length; ++i) {
            
                if(typeof ajaxSettings[settingsAttributes[i]] !== 'undefined') {
                    
                    clonedAjaxSettings[settingsAttributes[i]] = ajaxSettings[settingsAttributes[i]];
                
                }
            
            }
            
            return clonedAjaxSettings;
            
        },
        
        /**
         * Utility function used to create an OAuth 2.0 promise which is similar to a jQuery AJAX promise and which is 
         * returned by the overwritten AJAX method. This function allows the created OAuth 2.0 promise to has the same 
         * functions and properties as the promise returned by '$.ajax()'.
         * 
         * @param {jqXHR} jQueryAjaxPromise The jQuery AJAX promise to call and from which one to copy properties and 
         *        delegate function calls.
         * @returns {jqXHR} A new promise which is very similar to the provide jQuery AJAX promise.
         * 
         * @see https://github.com/jquery/jquery/blob/master/src/ajax.js
         */
        _createOAuthPromise : function(jQueryAjaxPromise) {
            
            var oAuthPromise = $.Deferred();
            
            // Builds headers hashtable if needed
            oAuthPromise.getResponseHeader = function(key) {
                return jQueryAjaxPromise.getResponseHeader(key);    
            };
            
            // Raw string
            oAuthPromise.getAllResponseHeaders = function() {
                return jQueryAjaxPromise.getAllResponseHeaders();
            };
            
            // Caches the header
            oAuthPromise.setRequestHeader = function(name, value) {
                jQueryAjaxPromise.setRequestHeader(name, value);
                return this;
            };
            
            // Overrides response content-type header
            oAuthPromise.overrideMimeType = function(type) {
                jQueryAjaxPromise.overrideMimeType(type);
                return this;
            };
            
            // Status-dependent callbacks
            oAuthPromise.statusCode = function(map) {
                jQueryAjaxPromise.statusCode(map);
                return this;
            };
            
            // Cancel the request
            oAuthPromise.abort = function(statusText) {
                jQueryAjaxPromise.abort(statusText);
                return this;
            };
            
            oAuthPromise.success = oAuthPromise.done;
            oAuthPromise.error = oAuthPromise.fail;
            
            oAuthPromise.readyState = jQueryAjaxPromise.readyState;
            oAuthPromise.status = jQueryAjaxPromise.status;
            oAuthPromise.statusText = jQueryAjaxPromise.statusText;
    
            return oAuthPromise;
            
        },
        
        /**
         * Function called when a request to a Web Service is successful.
         * 
         * @param {array} originalAjaxArguments The arguments passed to the overwrittent Backbone.ajax method.
         * @param {jQuery.Deferred} oauthPromise A jQuery promise object resolved when the original Web Service request is 
         *        successful.
         * @param {Object} data The data returned from the Web Service.
         * @param {string} textStatus The status of the HTTP request.
         * @param {XMLHttpRequest} jqXHR The XML HTTP request object used to do the request.
         */
        _jQueryAjaxPromiseDone : function(originalAjaxArguments, oauthPromise, data, textStatus, jqXHR) {
    
            // Resolves the OAuth promise wih exactly the same arguments as those passes to the resolve function of the 
            // promise return by 'Backbone.ajax'
            oauthPromise.resolve(data, textStatus, jqXHR);
    
        },
    
        /**
         * Function called when a request to a Web Service has failed. This function inspects the error response by parsing 
         * it with an error parser. If the parser returns 'refresh' then the Access Token is refreshed, if the parser 
         * returns 'reniew' then the Access Token is reniewed. In all other cases the wrapping Ajax promise is rejected with 
         * the encountered error.
         * 
         * @param {array} originalAjaxArguments The arguments passed to the overwrittent Backbone.ajax method.
         * @param {jQuery.Deferred} oauthPromise A jQuery promise object resolved when the original Web Service request is 
         *        successful.
         * @param {XMLHttpRequest} jqXHR The jQuery XML HTTP request which failed.
         * @param {string} status The status of the error.
         * @param {string} errorThrown The error thrown.
         */
        _jQueryAjaxPromiseFail : function(originalAjaxArguments, oauthPromise, jqXHR, status, errorThrown) {
    
            // Parse the received error to know if its a known OAuth 2.0 error
            var action = this._parseErrorFn(jqXHR);
            
            // If the parse result is not 'undefined' then this is a known OAuth 2.0 error
            if(action !== undefined) {
                
                switch(action) {
                    case 'refresh' :
                        
                        // Refresh the Access Token, if the refresh is successful then the promise will be resolved, 
                        // otherwise the promise will be rejected
                        this._refreshAccessToken(originalAjaxArguments, oauthPromise);
                        break;
    
                    case 'reniew' :
                    
                        // Reniew the Access Token, if the reniewal is successful then the promise will be resolved, 
                        // otherwise the promise will be rejected
                        this._reniewAccessToken(originalAjaxArguments, oauthPromise);
                        break;
    
                    default:
                        throw new Error('Action \'' + action + '\' is invalid !');
                }
    
            } 
            
            // Otherwise we are on an other kind of error
            else {
                
                // Rejects the OAuth promise with exactly the same arguments as those passed to the reject method call on 
                // the promise returned by 'Backbone.ajax' 
                oauthPromise.reject(jqXHR, status, errorThrown);
    
            }
    
        },
        
        /**
         * Utility function used to modify the settings object passed to the jQuery 'ajax' method by adding to it an OAuth 
         * 2.0 Access Token URL parameter.
         * 
         * @param {array} ajaxArguments The Javascript arguments variable get inside the overwritten Backbone.ajax method.
         */
        _updateAjaxArgumentsWithAccessToken : function(ajaxArguments) {
            
            // Try to get an OAuth 2.0 Access Token from the client storage
            var accessToken = this._storageManager.getAccessToken();
            
            // Appends the 'access_token' URL parameter
            if(accessToken) {
    
                // The '$.ajax' method is called with a URL directly provided
                if(typeof ajaxArguments[0] === 'string') {
                    
                    // FIXME: Ici on considère de manière systématique que la requête est authentifié ce qui n'est pas 
                    //        toujours ce que voudra le dévelopeur. Il nous faudrait peut-être un paramètre de configuration 
                    //        'securedByDefault'.
                    ajaxArguments[0] = OAuth.UrlUtils.addArgument(ajaxArguments[0], 'access_token', accessToken);
    
                }
                
                // The '$.ajax' method is called with a URL inside a configuration object, in this case we add the 
                // 'access_token' argument to the URL only if the 'secured' special parameter is true
                else if(ajaxArguments[0].secured) {
    
                    ajaxArguments[0].url = OAuth.UrlUtils.addArgument(ajaxArguments[0].url, 'access_token', accessToken);
    
                }
    
            }
            
        },
    
        /**
         * The overwritten 'Backbone.ajax' method.
         * 
         * @returns {$.Deferred} A JQuery promise which is resolved when the secured Web Service request has been 
         *          successfully executed. This promise is rejected if the Web Service returns an error which does not 
         *          corresponds to a 'refresh' or 'reniew' action.
         */
        _overwrittenBackboneDotAjax : function() {
    
            // The original AJAX arguments describes the initial user request
            var originalAjaxArguments = this._cloneAjaxArguments(arguments);
            
            // Updates the AJAX arguments by adding the OAuth 2.0 Access Token stored in the client storage
            this._updateAjaxArgumentsWithAccessToken(arguments);
    
            // The promise used to directly request the Web Service is not the returned promise. The returned promise is an 
            // other promise which is rejected when we are sure an Access Token refresh or reniewal is not useful to solve 
            // the problem. 
            var jQueryAjaxPromise = Backbone.$.ajax.apply(Backbone.$, arguments), 
                oAuthPromise = this._createOAuthPromise(jQueryAjaxPromise);
    
            // The fail callback has 2 different behaviors
            //  - If the response returned from the server indicates that the OAuth 2.0 Access Token is expired or needs a 
            //    reniewal then the refresh or reniew operation is done before calling 'Backbone.ajax' again with this URL
            //  - If the response returned is not associated to OAuth 2.0 or cannot be solved using an Access Token refresh 
            //    or reniewal then this callback rejects the returned promise
            jQueryAjaxPromise.fail($.proxy(this._jQueryAjaxPromiseFail, this, originalAjaxArguments, oAuthPromise));
            jQueryAjaxPromise.done($.proxy(this._jQueryAjaxPromiseDone, this, originalAjaxArguments, oAuthPromise));
    
            return oAuthPromise;
        
        },
        
        /**
         * Callback function called after an OAuth 2.0 Access Token has been successfully refreshed or reniewed and the 
         * original Web Service request has been replayed successfully.
         * 
         * @param {$.Deferred} oAuthPromise The jQuery promise resolved when the original Web Service request has been 
         *        successfully executed or rejected when the original Web Service request returns an error.
         * @param {Object} data The data returned by the original Web Service request.
         * @param {string} textStatus Always 'success' here because we are on the promise success callback.
         * @param {jqXHR} jqXHR The jquery XMLHttpRequest object used to execute the request.
         */
        _onOriginalRequestReplayedDone : function(oAuthPromise, data, textStatus, jqXHR) {
            
            oAuthPromise.resolve(data, textStatus, jqXHR);
            
        },
        
        /**
         * Callback function called after an OAuth 2.0 Access Token has been successfully refreshed or reniewed and the 
         * original Web Service request has been replayed with an error.
         * 
         * @param {$.Deferred} oAuthPromise The jQuery promise resolved when the original Web Service request has been 
         *        successfully executed or rejected when the original Web Service request returns an error.
         * @param {Object} data The data returned by the original Web Service request.
         * @param {string} textStatus Always 'success' here because we are on the promise success callback.
         * @param {jqXHR} jqXHR The jquery XMLHttpRequest object used to execute the request.
         */
        _onOriginalRequestReplayedFail : function(oAuthPromise, jqXHR, status, errorThrown) {
            
            oAuthPromise.reject(jqXHR, status, errorThrown);
            
        },
        
        /**
         * Callback function called when the refresh of an OAuth 2.0 Access Token is successful.
         * 
         * @param {array} originalAjaxArguments The arguments passed to the overwritten Backbone.ajax method.
         * @param {jQuery.Deferred} oAuthPromise A jQuery promise object resolved when the original Web Service request is 
         *        successful.
         * @param {Object} data The data returned from the OAuth 2.0 token endpoint.
         * @param {string} textStatus The status of the HTTP token refresh request.
         * @param {XMLHttpRequest} jqXHR The XML HTTP request object used to execute the token refresh request.
         */
        _onRefreshAccessTokenSuccess : function(originalAjaxArguments, oAuthPromise, data, textStatus, jqXHR) {
            
            // Store the refresed OAuth 2.0 in the local storage
            // WARNING: Please not that besides the standard OAuth 2.0 Access Token informations the 
            //          response also contain a 'user_id' field which is specific to the project and 
            //          contains the technical identifier of the user on the platform
            this._storageManager.persistRawAccessTokenResponse(JSON.stringify(data));
    
            var overwittenAjaxArguments = this._cloneAjaxArguments(originalAjaxArguments);
            overwittenAjaxArguments[0].secured = true; // TODO: Ceci devrait être dans le RequestContext
            
            // Updates the AJAX arguments by adding the OAuth 2.0 Access Token stored in the client storage
            // FIXME: Ici il se peut que les arguments AJAX aient déjà un token OAuth 2.0 et qu'il faille le remplacer....
            this._updateAjaxArgumentsWithAccessToken(overwittenAjaxArguments);
            
            // Re-executes the orginial request
            var ajaxPromise = $.ajax(overwittenAjaxArguments[0]);
            ajaxPromise.done($.proxy(this._onOriginalRequestReplayedDone, this, oAuthPromise));
            ajaxPromise.fail($.proxy(this._onOriginalRequestReplayedFail, this, oAuthPromise));
    
        },
        
        /**
         * Callback function called when the reniewal of an OAuth 2.0 Access Token is successful.
         * 
         * @param {array} originalAjaxArguments The arguments passed to the overwritten Backbone.ajax method.
         * @param {jQuery.Deferred} oAuthPromise A jQuery promise object resolved when the original Web Service request is 
         *        successful.
         * @param {Object} data The data returned from the OAuth 2.0 token endpoint.
         * @param {string} textStatus The status of the HTTP token refresh request.
         * @param {XMLHttpRequest} jqXHR The XML HTTP request object used to execute the token refresh request.
         */
        _onReniewAccessTokenSuccess : function(originalAjaxArguments, oAuthPromise, data, textStatus, jqXHR) {
            
            // Store the refresed OAuth 2.0 in the local storage
            // WARNING: Please not that besides the standard OAuth 2.0 Access Token informations the 
            //          response also contain a 'user_id' field which is specific to the project and 
            //          contains the technical identifier of the user on the platform
            this._storageManager.persistRawAccessTokenResponse(JSON.stringify(data));
    
            // Re-executes the orginial request
            var ajaxPromise = $.ajax(originalAjaxArguments);
            ajaxPromise.done($.proxy(this._onOriginalRequestReplayedDone, this, oAuthPromise));
            ajaxPromise.fail($.proxy(this._onOriginalRequestReplayedFail, this, oAuthPromise));
    
        },
        
        /**
         * Function used to refresh the OAuth 2.0 Access Token using the refresh token stored in the associated storage.
         * 
         * @param {array} originalAjaxArguments The arguments passed to the overwritten Backbone.ajax method.
         * @param {jQuery.Deferred} oAuthPromise A jQuery promise object resolved when the original Web Service request is 
         *        successful.
         */
        _refreshAccessToken : function(originalAjaxArguments, oAuthPromise) {
            
            // Try to get an OAuth 2.0 Refresh Token from the client storage
            var refreshToken = this._storageManager.getRefreshToken();
            
            // If a refresh token is stored on the client storage we try to refresh the access token using this refresh 
            // token
            if(refreshToken) {
    
                var ajaxPromise = $.ajax(
                    {
                        url : this._tokenEndpoint, 
                        data : {
                            grant_type : 'refresh_token', 
                            refresh_token : refreshToken,
                            client_id : this._clientId
                        }, 
                        dataType : 'json',
                        type: 'POST'
                    }
                );
                ajaxPromise.fail($.proxy(this._reniewAccessToken, this, oAuthPromise));
                ajaxPromise.done($.proxy(this._onRefreshAccessTokenSuccess, this, originalAjaxArguments, oAuthPromise));
    
            }
    
            // Otherwise we try to reniew the access token
            else {
    
                this._reniewAccessToken(originalAjaxArguments, oAuthPromise);
    
            }
    
        }, 
        
        /**
         * Function used to reniew the OAuth 2.0 Access Token using the refresh token stored in the associated storage.
         * 
         * @param {array} originalAjaxArguments The arguments passed to the overwritten Backbone.ajax method.
         * @param {jQuery.Deferred} oAuthPromise A jQuery promise object resolved when the original Web Service request is 
         *        successful.
         */
        _reniewAccessToken : function(originalAjaxArguments, oAuthPromise) {
    
            // If the Login Context is not initialized then it means that login has been done which is forbidden
            if(this._loginContext === null) {
    
                throw new Error('No login context found, did you miss to wrap your calls in \'OAuth.login\' ?');
    
            }
    
            console.log('_reniewAccessToken');
            
            // TODO: Créer un modèle de récupération de login / mdp ou credentials
    
            // A jQuery promise resolved when the 'loginFn' function calls the 'login' method of the Credentials Promise
            var deferred = $.Deferred();
            
            // Creates and configures a Login Context which is then received by the configured 'loginFn' method
            // var loginContext = new OAuth.LoginContext();
            // loginContext._setLoginCb(loginCb);
            // loginContext._setLoginOpts(opts);
            this._loginContext._setRequestManager(this);
            
            this._loginFn(this._loginContext);
    
            deferred.done($.proxy(this._onCredentialsPromiseDone, this, originalAjaxArguments, oAuthPromise));
            deferred.fail($.proxy(function() {
                
                // TODO: Erreur à gérer correctement
                console.log('_reniewAccessToken Error !');
                
            }, this));
            
            /*
            var deferred = $.Deferred(),
                loginContext = function(credentials, callback) {
                    deferred.resolve(credentials, callback);
                };
    
            this._loginFn(loginContext);
    
            deferred.done($.proxy(this._onCredentialsPromiseDone, this, originalAjaxArguments, oAuthPromise));
            deferred.fail(function() {
                
                // TODO: ???
    
            });
            */
            
        }, 
        
        _onCredentialsPromiseDone : function(originalAjaxArguments, oauthPromise, credentialsSettings) {
    
            switch(credentialsSettings.grant_type) {
                
                // Resource Owner Password Credentials
                // see: http://tools.ietf.org/html/rfc6749#section-1.3.3
                // see: http://tools.ietf.org/html/rfc6749#section-4.3
                case 'password':
                    var ajaxPromise = $.ajax(
                        {
                            contentType : 'application/x-www-form-urlencoded; charset=UTF-8',
                            data : {
                                grant_type : 'password',
                                username : credentialsSettings.username,
                                password : credentialsSettings.password,
                                client_id : this._clientId
                            },
                            type : 'POST',
                            url: this._tokenEndpoint
                        }
                    );
                    ajaxPromise.done($.proxy(this._onReniewAccessTokenSuccess, this, originalAjaxArguments, oauthPromise));
                    
                    // TODO: Echec complet ???
                    // ajaxPromise.fail($.proxy(this._onOriginalRequestReplayedFail, this, oauthPromise));
                    break;
                    
                // Client Credentials
                // see: http://tools.ietf.org/html/rfc6749#section-1.3.4
                // see: http://tools.ietf.org/html/rfc6749#section-4.4
                case 'client_credentials':
                    $.ajax(
                        {
                            contentType : 'application/x-www-form-urlencoded; charset=UTF-8',
                            data : {
                                grant_type : 'client_credentials',
                                client_id : this._clientId
                            },
                            type : 'POST',
                            url: this._tokenEndpoint        
                        }
                    );
                    break;
            }
            
        }
    
    };

    /**
     * Function used to create an OAuth.JS request manager which will overwrite the request function associated to a 
     * specified framework.
     * 
     * @param {string} framework The name of the framework for which one to overwrite the request function.
     * @param {object} settings A settings object used to configure the associated request manager.
     * 
     * @return {OAuth.Request.RequestManager} The created request manager.
     */
    OAuth.init = function(framework, settings) {

        switch(framework) {
            case 'angular':
                OAuth._requestManager = new OAuth.Request.AngularRequestManager(settings);
                break;
            case 'backbone':
                OAuth._requestManager = new OAuth.Request.BackboneRequestManager(settings);
                break;
            default:
                throw new Error('Unknown or unsupported framework \'' + framework + '\' !');
        }

        OAuth._requestManager.start();

    };
    
    // TODO: Ajouter la méthode 'getAuthResponse()'
    //       @see https://developers.facebook.com/docs/reference/javascript/FB.getAuthResponse
    
    OAuth.getLoginStatus = function(cb, forceServerCall) {
        
        return OAuth._requestManager.getLoginStatus(cb, forceServerCall);
        
    };

    /**
     * Function used to login a user. 
     * 
     * @param cb A callback function to be called when a login action has been done.
     * @param opts Options used to configure the login.
     */
    // FIXME: A renommer en 'requireConnection' ou 'secured()' ou 'authorized()', etc...
    OAuth.login = function(cb, opts) {
    
        return OAuth._requestManager.login(cb, opts);

    };
    
    /**
     * Function used to logout a user.
     * 
     * @param cb A callback to be called after the logout is done.
     */
    OAuth.logout = function(cb) {
        
        return OAuth._requestManager.logout(cb);
        
    };
    
    // FIXME: A renommer en 'login' (Pas sûr que ce soit bien car on est pas vraiment identique au SDK Facebook ici).
    OAuth.sendCredentials = function(credentials, cb, opts) {
        
        return OAuth._requestManager.sendCredentials(credentials, cb, opts);

    };

    return OAuth;

}));
