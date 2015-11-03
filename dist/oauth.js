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
    
    (function () {
    
        'use strict';
        
        // The XMLHttpRequest wrapper defined in this file does not work under IE5, IE7, IE8 and IE9
        // Their are several problems with those browser
        //  - We encounter the 'c00c023f' error 
        //    @see http://stackoverflow.com/questions/7287706/ie-9-javascript-error-c00c023f
        //    @see https://groups.google.com/forum/#!topic/websync/ysBEvtvMyb0
        //  - Even after solving the previous error IE crashes on a call to 'getAllResponseHeaders()'
        if(navigator.appVersion.indexOf('MSIE 7.') !== -1 ||
           navigator.appVersion.indexOf('MSIE 8.') !== -1 ||
           navigator.appVersion.indexOf('MSIE 9.') !== -1) {
    
            throw new Error('The oauth.js library does not support IE7, IE8 or IE9 !');
    
        }
    
        //@see https://xhr.spec.whatwg.org
        var OXMLHttpRequest = XMLHttpRequest;
        
        /**
         * Modified {@link XMLHttpRequest} object used by OAuth.JS, this modified xhr has several purposes : 
         *  * Most browsers do not allow a manual modification of an {@link XMLHttpRequest} object attributes, this is 
         *    perfectly normal because the WhatWG specification indicates those attributes have to be in a readonly mode. 
         *    But OAuth.JS requires those attributes to be writtable, so this modified {@link XMLHttpRequest} object allow 
         *    most of its attributes to be updated manually. 
         *  * The OAuth.JS have to be able to tag some {@link XMLHttpRequest} object it uses to work correctly and 
         *    differenciate its owns requests from requests performed by a developer or a framework. This modified 
         *    {@link XMLHttpRequest} object add a special `requestType` attribute to tag the type of the request.
         * 
         * @author Baptiste Gaillard (baptiste.gaillard@gomoob.com)
         * 
         * @returns {XMLHttpRequest} The created modified {@link XMLHttpRequest} object.
         */
        XMLHttpRequest = function() {
            
            ////////////////////////////////////////////////////////////////////////////////////////////////////////////////
            // Standard XMLHttpRequest elements
            ////////////////////////////////////////////////////////////////////////////////////////////////////////////////
            var This = this;
            
            this.oXMLHttpRequest = new OXMLHttpRequest(); 
            
            this.oXMLHttpRequest.onabort = function() {
                if(This.onabort) {
                    This.onabort();
                }
            };
            this.oXMLHttpRequest.onerror = function() {
                if(This.onerror) {
                    This.onerror();
                }
            };
            this.oXMLHttpRequest.onload = function() {
                if(This.onload) {
                    This.onload();
                }
            };
            this.oXMLHttpRequest.onloadend = function() {
                if(This.onloadend) {
                    This.onloadend();
                }
            };
            this.oXMLHttpRequest.onloadstart = function() {
                if(This.onloadstart) {
                    This.onloadstart();
                }
            };
            this.oXMLHttpRequest.onprogress = function() {
                if(This.onprogress) {
                    This.onprogress();
                }
            };
            this.oXMLHttpRequest.onreadystatechange = function() {
                
                This.readyState = this.readyState;
                This.response = this.response;
                This.responseText = this.responseText;
                This.responseType = this.responseType;
                This.responseURL = this.responseURL;
                This.responseXML = this.responseXML;
                This.status = this.status;
                This.statusText = this.statusText;
                This.timeout = this.timeout;
                This.upload = this.upload;
                This.withCredentials = this.withCredentials;
                
                if(This.onreadystatechange) {
                    This.onreadystatechange();
                }
            };
            this.oXMLHttpRequest.ontimeout = function() {
                if(This.ontimeout) {
                    This.ontimeout();
                }
            };
    
            ////////////////////////////////////////////////////////////////////////////////////////////////////////////////
            // Specific OAuth.JS XMLHttpRequest elements
            ////////////////////////////////////////////////////////////////////////////////////////////////////////////////
            this.requestType = null;
    
            this.isResourceRequest = function() {
            
                return this.requestType !== '__oauth_js_send_credentials__';
    
            };
            
        };
    
        XMLHttpRequest.prototype = {};
        
        XMLHttpRequest.DONE = 4;
        XMLHttpRequest.HEADERS_RECEIVED = 2;
        XMLHttpRequest.LOADING = 3;
        XMLHttpRequest.OPENED = 1;
        XMLHttpRequest.UNSENT = 0;
        
        XMLHttpRequest.prototype.abort = function() {
            return this.oXMLHttpRequest.abort();
        };
        XMLHttpRequest.prototype.open = function(sMethod, sUrl, bAsync, sUser, sPassword) {
            return this.oXMLHttpRequest.open(sMethod, sUrl, bAsync, sUser, sPassword);
        };
        XMLHttpRequest.prototype.overrideMimeType = function(mime) {
            return this.oXMLHttpRequest.overrideMimeType(mime);
        };
        XMLHttpRequest.prototype.send = function(data) {
            return this.oXMLHttpRequest.send(data);
        };
        XMLHttpRequest.prototype.getAllResponseHeaders = function() {
            return this.oXMLHttpRequest.getAllResponseHeaders();
        };
        XMLHttpRequest.prototype.getResponseHeader = function(name) {
            return this.oXMLHttpRequest.getResponseHeader(name);
        };
        XMLHttpRequest.prototype.setRequestHeader  = function(name, value) {
            return this.oXMLHttpRequest.setRequestHeader(name, value);
        };
        
        // IE ???
        // @see http://developer.blackberry.com/html5/documentation/v1_0/xmlhttprequest_dispatchevent_620051_11.html
    //    XMLHttpRequest.prototype.dispatchEvent  = function(type, listener, useCapture) {
    //        return this.oXMLHttpRequest.dispatchEvent(type, listener, useCapture);
    //    };
        // @see http://docs.blackberry.com/ko-kr/developers/deliverables/11849/XMLHttpRequest_addEventListener_573783_11.jsp
    //    XMLHttpRequest.prototype.addEventListener  = function(type, listener, useCapture) {
    //        return this.oXMLHttpRequest.addEventListener(type, listener, useCapture);
    //    };
        // @see http://docs.blackberry.com/en/developers/deliverables/11849/XMLHttpRequest_removeEventListener_620054_11.jsp
    //    XMLHttpRequest.prototype.removeEventListener  = function(type, listener, useCapture) {
    //        return this.oXMLHttpRequest.removeEventListener(type, listener, useCapture);
    //    };
    
        // FIREFOX ???
        // XMLHttpRequest.prototype.sendAsBinary = function(data) {
        //    return this.oXMLHttpRequest.sendAsBinary(data);
        // };
        
    })();

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
        
        ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
        // PRIVATE MEMBERS
        ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
        
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
        
        ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
        // PUBLIC MEMBERS
        ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    
        /**
         * Gets the Access Token Response object which was used to create this AuthStatus object. In most cases this Access 
         * Token Response object is only useful by the developer to inspect error responses. Successful responses are useful 
         * internally but the developer can only call the {@link #isConnected()} function.
         * 
         * The Access Token Response can be null when the user is disconnected and the disconnection operation was a manual 
         * disconnection (i.e not an automatic disconnection following an error).
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
                accessTokenResponse : _accessTokenResponse ? _accessTokenResponse.toJSON() : null
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
        
        // If no access token response is provided than the status MUST BE equal to 'disconnected'
        if(!settings.accessTokenResponse && settings.status !== 'disconnected') {
            
            throw new Error('An AuthStatus without an access token response must always be disconnected !');
            
        }
    
        // If an access token response is provided it must be an object
        else if(settings.accessTokenResponse && typeof settings.accessTokenResponse !== 'object') {
            
            throw new Error(
                'The settings object has an invalid access token response object !'
            );
    
        }
        
        _status = settings.status;
        _accessTokenResponse = settings.accessTokenResponse ? settings.accessTokenResponse : null;
    
    };
    
    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    //STATIC MEMBERS
    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    
    /**
     * Function used to create an {@link OAuth.AuthStatus} object which indicate that the content of the storage has been 
     * corrupted. A storage content is corrupted when a malicious user manually update its content. 
     * 
     * @return {OAuth.AuthStatus} An {@link OAuth.AuthStatus} object which indicate that the content of the storage has been 
     *         corrupted.
     */
    OAuth.AuthStatus.createCorrupted = function() {
        
        var accessTokenResponse = null, 
            authStatus = null;
        
        accessTokenResponse = new OAuth.AccessToken.CriticalErrorResponse();
        accessTokenResponse.setError('__oauth_js__storage_corrupted__');
        authStatus = new OAuth.AuthStatus(
            {
                status : 'disconnected',
                accessTokenResponse : accessTokenResponse
            }
        );
        
        return authStatus;
        
    };
    
    /**
     * Function used to create an {@link OAuth.AuthStatus} object from a JSON string representation. In most cases this 
     * function is used to create an {@link OAuth.AuthStatus} javascript object from data pulled from a specific storage 
     * mechanism. 
     * 
     * @param {String} string The string to convert into an {@link OAuth.AuthStatus} object.
     * 
     * @return {OAuth.AuthStatus} The created {@link OAuth.AuthStatus} object.
     */
    OAuth.AuthStatus.createFromString = function(string) {
    
        var authStatus = null;
        
        // The provided parameter must be a string
        if(typeof string !== 'string') {
    
            authStatus = OAuth.AuthStatus.createCorrupted();
            
        } 
    
        // The provided parameter is a string, convert it to a JSON representation and validates this representation
        else {
    
            // The provided parameter must be a valid JSON object
            var authStatusJson = null; 
        
            try {
                authStatusJson = JSON.parse(string);
                
                // The AuthStatus JSON representation is valid
                if(OAuth.AuthStatus.isJsonValid(authStatusJson)) {
                    
                    authStatus = new OAuth.AuthStatus(
                        {
                            status : authStatusJson.status, 
                            accessTokenResponse : OAuth.AccessToken.AbstractResponse.createFromJson(
                                authStatusJson.accessTokenResponse
                            )
                        }
                    );
                    
                }
    
                // The AuthStatus JSON representation is invalid
                else {
                    
                    authStatus = OAuth.AuthStatus.createCorrupted();
    
                }
                
            } catch(syntaxError) {
                
                authStatus = OAuth.AuthStatus.createCorrupted();
    
            }
        }
    
        return authStatus;
    
    };
    
    /**
     * Function used to check if a JSON object corresponds to a valid {@link OAuth.AuthStatus} JSON representation. The 
     * purpose of this function is to validate what would be returned by the {@link OAuth.AuthStatus#toJSON()} method.
     * 
     * @param {Object} jsonObject The JSON representation to validate.
     * 
     * @return {Boolean} True if the provided JSON representation is a valid representation of an {@link OAuth.AuthStatus} 
     *         object, false otherwise.
     */
    OAuth.AuthStatus.isJsonValid = function(jsonObject) {
        
        // The parameter MUST BE a JSON object
        var valid = OAuth.ObjectUtils.isObject(jsonObject);
        
        // The 'status' parameter MUST BE equal to 'connected' or 'disconnected'
        valid = valid && (jsonObject.status === 'connected' || jsonObject.status === 'disconnected');
        
        // If the 'accessTokenResponse' is provided and not null it MUST BE valid
        if(jsonObject.accessTokenResponse !== null) {
    
            valid = valid && OAuth.AccessToken.AbstractResponse.isJsonValid(jsonObject.accessTokenResponse);
    
        }
        
        return valid;
        
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
     * Class used to provide utilities to manipulate objects.
     * 
     * @author Baptiste GAILLARD (baptiste.gaillard@gomoob.com)
     * @class ObjectUtils
     * @memberof OAuth
     */
    OAuth.ObjectUtils = {
    
        /**
         * Returns true if value is an Object. Note that JavaScript arrays and functions are objects, while (normal) strings 
         * and numbers are not.
         * 
         * @param {*} obj The value to check.
         * 
         * @returns {Boolean} True if the value is an object or a function, false otherwise.
         */
        isObject : function(obj) {
            
            // Do not modify this peace of code because its a pure copy of Underscore JS '_.isObject(value)'
            // @see http://underscorejs.org/#isObject
            var type = typeof obj;
            return type === 'function' || type === 'object' && !!obj;
    
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
     * Class which represents a Request Context, a request context is an object which transports informations about an 
     * OAuth.JS request.
     * 
     * @author Baptiste GAILLARD (baptiste.gaillard@gomoob.com)
     * @class RequestContext
     * @memberof OAuth
     */
    OAuth.RequestContext = function() {
        
        // 'originalXhr' : L'objet XMLHttpRequest utilisé par le développeut ou au sein du Framework Javascript pour 
        //                récupérer une resource
        // 'replacedXhr' : L'objet XMLHttpRequest utilisé en lieu et place de 'originalXhr' pour executer la requête du 
        //                 dévelopeur ou du Framework
        // 'refreshXhr'  : L'objet XMLHttpRequest utilisé lorsqu'une réponse serveur a indiqué que l'accès à une resource 
        //                 n'était pas possible à cause d'un Access Token expiré
        // 'replayXhr'   : L'objet XMLHttpRequest utilisé pour rejouer la même requête que la requête de départ 
        //                 'originalXhr' suite à une rafraichissement de Token OAuth 2.0
    
        this.originalXhr = {
            xhr : null, 
            args : {
                open : null,
                send : null,
                setRequestHeader : null
            }
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
        if(OAuth.ObjectUtils.isObject(configuration)) {
    
            // Configure the storage class
            if ((configuration.hasOwnProperty('storage')) &&
                (typeof configuration.storage === 'object')) {
    
                this._storage = configuration.storage;
    
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
            
            this._storage.removeItem(this._storageKey + '.authStatus');
            
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
    
        // TODO: A documenter et tester...
        getAuthStatus : function() {
    
            var authStatus = null, 
                authStatusString = null;
            
            // Retrieve the AuthStatus string representation from the storage
            authStatusString = this._storage.getItem(this._storageKey + '.authStatus');
    
            // If an AuthStatus string has been found on the storage
            if(authStatusString) {
    
                // Creates the AuthStatus object by parsing the AuthStatus string
                authStatus = OAuth.AuthStatus.createFromString(authStatusString);
    
            } 
            
            // Create a disconnected AuthStatus
            else {
                
                authStatus = new OAuth.AuthStatus({ status : 'disconnected' });
                
            }
            
            // We always update the AuthStatus in the storage. This is VERY IMPORTANT because if the AuthStatus has been 
            // manually updated outside the application and the data in the storage are corrupted we have to refresh those 
            // data to valid values. 
            this.persistAuthStatus(authStatus);
            
            return authStatus;
    
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
        
        // TODO: A blinder, documenter et tester...
        persistAuthStatus : function(authStatus) {
            
            this._storage.setItem(this._storageKey + '.authStatus', authStatus.toString());
            
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
            if(xhr.readyState !== XMLHttpRequest.DONE) {
    
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
            this.persistAuthStatus(authStatus);
    
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
     * @see https://xhr.spec.whatwg.org
     */
    OAuth.XhrUtils = {
    
        /**
         * Utility function used to copy all the attributes of an {@link XMLHttpRequest} object to an other 
         * {@link XMLHttpRequest} object. 
         * 
         * Here what we call "attributes" references all the elements marked as "attribute" in the WhatWG XMLHttpRequest 2 
         * specifications :
         * 
         *  * [4.4 States](https://xhr.spec.whatwg.org/#states "States")
         *    * `readyState` attribute
         *  
         *  * [4.5 Request](https://xhr.spec.whatwg.org/#request "Request") attributes
         *    * `timeout` attribute 
         *    * `withCredentials` attribute
    
         *  * [4.6 Response](https://xhr.spec.whatwg.org/#xmlhttprequest-response "Response") attributes
         *    * `responseURL` attribute
         *    * `status` attribute
         *    * `statusText` attribute
         *    * `responseType` attribute
         *    * `response` attribute
         *    * `responseText` attribute
         *    * `responseXML` attribute
         * 
         * **NOTE**    : Please note that the request `upload` attribute is never copied because listeners could have been 
         *               attached to the `upload` attribute of the xhr the attributes are copied to.
         * 
         * **WARNING** : Please note that this copy is only possible if the provided {@link XMLHttpRequest} are instance of 
         *               the modified {@link XMLHttpRequest} object defined in the OAuth.JS project. This is very important 
         *               because otherwise some browser will simply forbid any change to the target {@link XMLHttpRequest} 
         *               object (this behavior is implemented as is in browsers to prevent an xhr to be in an invalid state)
         *               . 
         * 
         * @param {XMLHttpRequest} fromXhr The {@link XMLHttpRequest} object from which one to copy properties.
         * @param {XMLHttpRequest} toXhr The {@link XMLHttpRequest} object to which one to copy properties.
         */
        copyAttributes : function(fromXhr, toXhr) {
            
            // [4.4 States](https://xhr.spec.whatwg.org/#states "States")
            toXhr.readyState      = fromXhr.readyState;
            
            // [4.5 Request](https://xhr.spec.whatwg.org/#request "Request") attributes
            toXhr.timeout         = fromXhr.timeout;
            toXhr.withCredentials = fromXhr.withCredentials;
            
            // [4.6 Response](https://xhr.spec.whatwg.org/#xmlhttprequest-response "Response") attributes
            toXhr.responseURL     = fromXhr.responseURL;
            toXhr.status          = fromXhr.status;
            toXhr.statusText      = fromXhr.statusText;
            toXhr.responseType    = fromXhr.responseType;
            toXhr.response        = fromXhr.response;
            toXhr.responseText    = fromXhr.responseText;
            toXhr.responseXML     = fromXhr.responseXML;
    
        },
                      
        // TODO: A documenter & tester
        fromJSON : function(jsonObject) {
    
            return {
                onabort: null,
                onerror: null,
                onload: null,
                onloadend: null,
                onloadstart: null,
                onprogress: null,
                onreadystatechange: null,
                ontimeout: null,
                readyState: jsonObject.readyState,
                response: jsonObject.response,
                responseText: jsonObject.responseText,
                responseType: "", // FIXME: Ceci n'est pas dans notre implémentation !
                responseURL: "",  // FIXME: Ceci n'est pas dans notee implémentation 
                                  //        @see https://xhr.spec.whatwg.org/#the-responseurl-attribute
                responseXML: jsonObject.responseXML,
                status: jsonObject.status,
                statusText: jsonObject.statusText,
                timeout: 0,       // FIXME: Ceci n'est pas dans notre implémentation 
                                  //        @see https://xhr.spec.whatwg.org/#the-timeout-attribute
                upload: {
                    onabort: null,
                    onerror: null,
                    onload: null,
                    onloadend: null,
                    onloadstart: null,
                    onprogress: null,
                    ontimeout: null
                },
            
                withCredentials: false // FIXME: Ceci n'est pas dans notre implémentation
                                       //        @see https://xhr.spec.whatwg.org/#the-withcredentials-attribute
            };
    
        },
    
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
            
            // @see https://xhr.spec.whatwg.org/
            // FIXME: Il manque 'responseType', 'responseURL', 'timeout', 'withCredentials'
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
        var valid = OAuth.ObjectUtils.isObject(jsonObject);
        
        // If previous rules are valid
        if(valid) { 
        
            // Validates the 'jsonResponse' object property
            if(OAuth.ObjectUtils.isObject(jsonObject.jsonResponse) && 
               typeof jsonObject.jsonResponse.error === 'string') {
                
                valid = valid && OAuth.AccessToken.ErrorResponse.isJsonResponseValid(jsonObject.jsonResponse);
                
            } else {
                
                valid = valid && OAuth.AccessToken.SuccessfulResponse.isJsonResponseValid(jsonObject.jsonResponse);
                
            }
            
            // Validates the 'xhr' object property
            valid = valid && OAuth.AccessToken.AbstractResponse.isJsonXhrValid(jsonObject.xhr);
    
        }
        
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
        var valid = OAuth.ObjectUtils.isObject(jsonXhr);
    
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
        '__oauth_js__status_lt_1xx__',
        
        // TODO: A documenter, cette documentation doit apparaître dans le JSDoc, on doit avoir une référence à la règle 
        //       des spécifications OAuth 2.0 qui est violée
        '__oauth_js__status_1xx__',
        
        // TODO: A documenter, cette documentation doit apparaître dans le JSDoc, on doit avoir une référence à la règle 
        //       des spécifications OAuth 2.0 qui est violée
        '__oauth_js__status_2xx__',
        
        // TODO: A documenter, cette documentation doit apparaître dans le JSDoc, on doit avoir une référence à la règle 
        //       des spécifications OAuth 2.0 qui est violée
        '__oauth_js__status_3xx__',
        
        // TODO: A documenter, cette documentation doit apparaître dans le JSDoc, on doit avoir une référence à la règle 
        //       des spécifications OAuth 2.0 qui est violée
        '__oauth_js__status_4xx__',
        
        // TODO: A documenter, cette documentation doit apparaître dans le JSDoc, on doit avoir une référence à la règle 
        //       des spécifications OAuth 2.0 qui est violée
        '__oauth_js__status_5xx__',
        
        // TODO: A documenter, cette documentation doit apparaître dans le JSDoc, on doit avoir une référence à la règle 
        //       des spécifications OAuth 2.0 qui est violée
        '__oauth_js__status_gt_5xx__',
        
        // TODO: A documenter, cette documentation doit apparaître dans le JSDoc, on doit avoir une référence à la règle 
        //       des spécifications OAuth 2.0 qui est violée
        '__oauth_js__storage_corrupted__',
        
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
        var valid = OAuth.ObjectUtils.isObject(jsonResponse);
        
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
            accessTokenResponse.setJsonResponse(jsonObject);
            accessTokenResponse.setXhr(xhr);
    
            // The XMLHttpRequest 'readyState' must be DONE
            // TODO:
            // '__oauth_js__ready_state_invalid__'
    
            // The XMLHttpRequest 'status' must be equal to 400 (Bad Request)
            // @see https://tools.ietf.org/html/rfc6749#section-5.2
            // TODO: En fonction de la valeur de status
            // '__oauth_js__status_lt_1xx__',
            // '__oauth_js__status_1xx__',
            // '__oauth_js__status_2xx__',
            // '__oauth_js__status_3xx__',
            // '__oauth_js__status_4xx__',
            // '__oauth_js__status_5xx__',
            // '__oauth_js__status_gt_5xx__',
            
            accessTokenResponse.setError(jsonObject.error);
            
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
         * The function used to retrieve credentials to get an OAuth 2.0 Access Token.
         * 
         * @instance
         * @private
         */
        // TODO: A documenter mieux que celà (notamment le type)...
        this._loginFn = null;
        
        /**
         * The function used to parse errors returned by the Web Services.
         * 
         * @instance
         * @private
         */
        // TODO: A documenter mieux que celà (notamment le type)...
        this._parseErrorFn = null;
    
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
    
            // Very simple, simply call the provided callback with the stored AuthStatus
            cb(this._storageManager.getAuthStatus());
    
        };
        
        /**
         * Function used to logout a user.
         * 
         * @param logoutCb A callback to be called after the logout is done.
         */
        this.logout = function(logoutCb) {
          
            // Clears the storage manage by the storage manager
            // FIXME: Le logout devrait persister un AuthStatus disconnected à la place...
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
        
        /**
         * A reference to the original AngularJS `$http` service, this reference is backuped before OAuth.JS creates a 
         * decorator around this `$http` service to modify its default behavior.
         * 
         * @instance
         * @private
         * @type {service.$http}
         * @see https://docs.angularjs.org/api/ng/service/$http
         */
        this._$http = null;
        
        /**
         * A reference to the AngularJS `$provide` service, this is used by OAuth.JS to create a decorator around the 
         * `$http` service to overwrite default request behavior.
         * 
         * @instance
         * @private
         * @type {auto.$provide}
         * @see https://docs.angularjs.org/api/auto/service/$provide
         */
        // FIXME: Il est peut-être plus logique de configurer le Request Manager avec l'$injector plustôt car il permet de 
        //        récupérer le '$provide'. Regarder aussi le rôle de 'window.angular'...
        this._$provide = configuration.$provide;
    
        // If a specific configuration is provided
        if(OAuth.ObjectUtils.isObject(configuration)) {
    
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
    
        /**
         * Function used to send credentials use the configured OAuth 2.0 Token Endpoint.
         * 
         * @param {Object} credentials TODO A DOCUMENTER
         * @param {Function} cb TODO A DOCUMENTER
         * @param {Object} opts TODO A DOCUMENTER
         */
        // TODO: A tester et documenter...
        sendCredentials : function(credentials, cb, opts) {
    
            this._loginContext = new OAuth.LoginContext();
            this._loginContext._setLoginCb(cb);
            this._loginContext._setLoginOpts(opts);
            this._loginContext._setRequestManager(this);
    
            var xhr = new XMLHttpRequest();
            xhr.requestType = '__oauth_js_send_credentials__';
    
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
                    
                    // Firefox bug
                    // @see https://bugzilla.mozilla.org/show_bug.cgi?id=416178
                    // @see http://www.w3.org/TR/html5/forms.html#application/x-www-form-urlencoded-encoding-algorithm
                    // @see https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequest#sendAsBinary()_polyfill
                    if(navigator.userAgent.toLowerCase().indexOf('firefox') > -1)
                    {
                        var sData = OAuth.UrlUtils.toQueryString(
                            {
                                grant_type : credentials.grant_type,
                                client_id : this._clientId,
                                username : credentials.username,
                                password : credentials.password
                            }
                        );                  
                        
                        var nBytes = sData.length, 
                            ui8Data = new Uint8Array(nBytes);
                        
                        for (var nIdx = 0; nIdx < nBytes; nIdx++) {
                            ui8Data[nIdx] = sData.charCodeAt(nIdx) & 0xff;
                        }
                                        
                        xhr.send(ui8Data);
                        
                    } 
                    
                    // All other browsers
                    else {
                    
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
                        
                    }
    
                    var This = this;
    
                    xhr.onreadystatechange = function() {
    
                        // @see https://github.com/ilinsky/xmlhttprequest/blob/master/XMLHttpRequest.js#L57
                        // If the 'readyState' is DONE then the server returned a response
                        if(xhr.readyState === XMLHttpRequest.DONE) {
                            
                            This._onTokenEndpointPost(xhr);
    
                        }
    
                    };
                    
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
        // TODO: Renommer cette méthode car elle doit être appelée uniquement après un login et pas pour un rafraichissement 
        //       de token
        _onTokenEndpointPost : function(xhr) {
    
            // TODO: Les callbacks de login sont appelés dans tous les cas, il est souvent fréquent que l'on ne souhaite pas 
            //       appeler le callback tant que le formulaire de login n'est pas rempli. Il nous faudrait une option pour 
            //       ceci. 
    
            var authStatus = null, 
                loginCb = this._loginContext.getLoginCb(),
                loginFnCb = this._loginContext.getLoginFnCb();
    
            // Persists the response as an OAuthStatus object
            authStatus = this._storageManager.persistAccessTokenResponse(xhr);
    
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
            
            // If the client is considered disconnected
            if(this._storageManager.getAuthStatus().isDisconnected()) {
        
                // Calls the configured 'loginFn' method, this one will resolve the credentials promise by providing 
                // credentials
                this._loginFn(this._loginContext);
        
                // FIXME: Ici il serait beaucoup plus propre que la credentials promise lève un événement une fois la fin de 
                //        l'exécution de 'sendCredentials' et que le Request Manager écoute cet événement. Ainsi la 
                //        Credentials Promise n'aurait pas à dépendre du Request Manager
        
            }
            
            // Otherwise if the user is considered connected we call the callback directly
            // Please note that even if the client is considered connected the 'loginCb' callback can execute secured 
            // OAuth 2.0 HTTP requests which will change the current AuthStatus state to a 'disconnected' status if an error 
            // is encountered
            else {
    
                loginCb(this._storageManager.getAuthStatus());
    
            }
            
        },
    
        _onRefreshAccessTokenPost : function(xhr, requestContext) {
    
            // Persists the response as an OAuthStatus object
            var authStatus = this._storageManager.persistAccessTokenResponse(xhr);
    
            // If the user is considered connected (i.e the OAuth 2.0 Access Token refresh was successful) the replay the 
            // original request
            if(authStatus.isConnected()) {
                
                this._replayXhr = new XMLHttpRequest();
                
                this._replayXhr.open = this._backupedOpen;
                this._replayXhr.send = this._backupedSend;
                this._replayXhr.setRequestHeader = this._backupedSetRequestHeader;
                
                // Updates the original XMLHttpRequest URL used to modify the 'access_token' parameter with the new one we 
                // retrieved
                requestContext.originalXhr.args.open[1] = OAuth.UrlUtils.addArgument(
                    requestContext.originalXhr.args.open[1], 
                    'access_token',
                    authStatus.getAccessTokenResponse().getJsonResponse().access_token
                );
                
                // @see https://github.com/ilinsky/xmlhttprequest/blob/master/XMLHttpRequest.js#L91
                this._replayXhr.open.apply(this._replayXhr, requestContext.originalXhr.args.open);
                
                // @see https://github.com/ilinsky/xmlhttprequest/blob/master/XMLHttpRequest.js#L330
                this._replayXhr.setRequestHeader.apply(this._replayXhr, requestContext.originalXhr.args.setRequestHeader);
                
                // @see https://github.com/ilinsky/xmlhttprequest/blob/master/XMLHttpRequest.js#L263
                this._replayXhr.send.apply(this._replayXhr, requestContext.originalXhr.args.send);
                
                var This = this;
                
                this._replayXhr.onreadystatechange = function() {
    
                    var originalXhr = requestContext.originalXhr.xhr;
    
                    // @see https://github.com/ilinsky/xmlhttprequest/blob/master/XMLHttpRequest.js#L57
                    // If the 'readyState' is DONE then the server returned a response
                    if(This._replayXhr.readyState === XMLHttpRequest.DONE) {
    
                        // Copy all the XMLHttpRequest attribute of the "replay xhr" to the "original xhr" to propagate its 
                        // state 
                        OAuth.XhrUtils.copyAttributes(This._replayXhr, originalXhr);
                        
                        // The server returned a 2xx HTTP Response
                        if(This._replayXhr.status >= 200 && This._replayXhr.status < 300) {
    
                            if(originalXhr.onreadystatechange) { 
                                originalXhr.onreadystatechange();
                            }
    
                            if(originalXhr.onload) {
                                originalXhr.onload();
                            }
                            
                        } 
                        
                        // The server returned an other HTTP Response
                        else {
                        
                            console.log('Error after replay...');
    
                        }
    
                    }
                    
                };
    
            } 
            
            // Otherwise if the AuthStatus is disconnected it means that the refresh token request returned an error, in 
            // this case we redirect the user to the login form 
            else {
    
                // Calls the configured 'loginFn' method, this one will resolve the credentials promise by providing 
                // credentials
                this._loginFn(this._loginContext);
    
            }
            
        },
        
        _refreshAccessToken : function(requestContext) {
    
            var This = this;
            
            // Gets the current authentication status
            var authStatus = this._storageManager.getAuthStatus();
    
            // Refresh the Access Token, if the refresh is successful then the 'replacedHttpPromise' will be 
            // resolved, otherwise the 'replacedHttpPromise' will be rejected
            var refreshXhr = new XMLHttpRequest();
            refreshXhr.open = this._backupedOpen;
            refreshXhr.send = this._backupedSend;
            refreshXhr.setRequestHeader = this._backupedSetRequestHeader;
            
            // @see https://github.com/ilinsky/xmlhttprequest/blob/master/XMLHttpRequest.js#L91
            refreshXhr.open(
                'POST',                // Method
                this._tokenEndpoint,   // URL
                true                   // Async
            );
            
            // @see https://github.com/ilinsky/xmlhttprequest/blob/master/XMLHttpRequest.js#L330
            refreshXhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
            
            // @see https://github.com/ilinsky/xmlhttprequest/blob/master/XMLHttpRequest.js#L263
            refreshXhr.send(
                OAuth.UrlUtils.toQueryString(
                    {
                        grant_type : 'refresh_token',
                        client_id : this._clientId,
                        refresh_token : authStatus.getAccessTokenResponse().getJsonResponse().refresh_token
                    }
                )
            );
            
            refreshXhr.onreadystatechange = function() {
    
                // @see https://github.com/ilinsky/xmlhttprequest/blob/master/XMLHttpRequest.js#L57
                // If the 'readyState' is DONE then the server returned a response
                if(refreshXhr.readyState === XMLHttpRequest.DONE) {
    
                    This._onRefreshAccessTokenPost(refreshXhr, requestContext);
    
                }
                
            };
    
        },
        
        /**
         * Start the AngularJS Request Manager, the purpose of the start method is to overwrites the Angular JS HTTP service 
         * to manage OAuth 2.0 Access Token operations transparently.
         */
        start : function() {
            
            var This = this;
            
            this._$provide.decorator(
                '$http', 
                [
                    '$delegate',
                    function($delegate) {
                    
                        This._$http = $delegate;
                        
                        // Create a wrapper which will proxy all its call to the original Angular JS '$http' service 
                        // configured in the request manager
                        var $httpWrapper = function() {
                        
                            // Update the arguments to add or update the 'access_token' URL argument if the 'secured' 
                            // parameter is true
                            var updatedArguments = arguments; 
                            updatedArguments[0] = This._updateAngularHttpConfig(updatedArguments[0]);
                            
                            // Calls the Angular JS `$http` method with the updated arguments, when the `http` method will 
                            // call an XMLHttpRequest it will call the methods overwritten by OAuth.JS to manage OAuth 2.0 
                            // Access Token refresh if necessary.
                            return This._$http.apply(This._$http, updatedArguments);
         
                        };
        
                        // Overwrite the Angular JS '$http.get(url, [config])' method
                        $httpWrapper.get = function() {
                                
                            // Transform the parameters to parameters compliant with '$http(config)'
                            // TODO: Créer une méthode '_transformHttpShortcutMethodArguments(arguments)'
                            var updatedArguments = arguments[1]; 
                            updatedArguments.method = 'GET';
                            updatedArguments.url = arguments[0];
        
                            // Delegate the call to '$http(config)'
                            return new $httpWrapper(updatedArguments);
        
                        };
        
                        // Overwrite the Angular JS '$http.head(url, [config])' method
                        $httpWrapper.head = function() {
                                
                            // Transform the parameters to parameters compliant with '$http(config)'
                            // TODO: Créer une méthode '_transformHttpShortcutMethodArguments(arguments)'
                            var updatedArguments = arguments[1]; 
                            updatedArguments.method = 'HEAD';
                            updatedArguments.url = arguments[0];
        
                            // Delegate the call to '$http(config)'
                            return new $httpWrapper(updatedArguments);
        
                        };
                        
                        // Overwrite the Angular JS '$http.post(url, data, [config])' method
                        $httpWrapper.post = function() {
                                
                            // Transform the parameters to parameters compliant with '$http(config)'
                            // TODO: Créer une méthode '_transformHttpShortcutMethodArguments(arguments)'
                            var updatedArguments = arguments[2];
                            updatedArguments.data = arguments[1];
                            updatedArguments.method = 'POST';
                            updatedArguments.url = arguments[0];
        
                            // Delegate the call to '$http(config)'
                            return new $httpWrapper(updatedArguments);
        
                        };
                        
                        // Overwrite the Angular JS '$http.put(url, data, [config])' method
                        $httpWrapper.put = function() {
                                
                            // Transform the parameters to parameters compliant with '$http(config)'
                            // TODO: Créer une méthode '_transformHttpShortcutMethodArguments(arguments)'
                            var updatedArguments = arguments[2];
                            updatedArguments.data = arguments[1];
                            updatedArguments.method = 'POST';
                            updatedArguments.url = arguments[0];
        
                            // Delegate the call to '$http(config)'
                            return new $httpWrapper(updatedArguments);
        
                        };
                        
                        // Overwrite the Angular JS '$http.delete(url, [config])' method
                        $httpWrapper.delete = function() {
                                
                            // Transform the parameters to parameters compliant with '$http(config)'
                            // TODO: Créer une méthode '_transformHttpShortcutMethodArguments(arguments)'
                            var updatedArguments = arguments[1]; 
                            updatedArguments.method = 'HEAD';
                            updatedArguments.url = arguments[0];
        
                            // Delegate the call to '$http(config)'
                            return new $httpWrapper(updatedArguments);
        
                        };
                        
                        // Overwrite the Angular JS '$http.jsonp(url, [config])' method
                        $httpWrapper.jsonp = function() {
                                
                            // Transform the parameters to parameters compliant with '$http(config)'
                            // TODO: Créer une méthode '_transformHttpShortcutMethodArguments(arguments)'
                            var updatedArguments = arguments[1]; 
                            updatedArguments.method = 'JSONP';
                            updatedArguments.url = arguments[0];
        
                            // Delegate the call to '$http(config)'
                            return new $httpWrapper(updatedArguments);
                            
                        };
                        
                        // Overwrite the Angular JS '$http.patch(url, data, [config])' method
                        $httpWrapper.patch = function() {
                                
                            // Transform the parameters to parameters compliant with '$http(config)'
                            // TODO: Créer une méthode '_transformHttpShortcutMethodArguments(arguments)'
                            var updatedArguments = arguments[2];
                            updatedArguments.data = arguments[1];
                            updatedArguments.method = 'POST';
                            updatedArguments.url = arguments[0];
        
                            // Delegate the call to '$http(config)'
                            return new $httpWrapper(updatedArguments);
        
                        };
        
                        return $httpWrapper;
                        
                    }
                ]
            );
    
            // Backup the original XHMLHttpRequest 'open' method to reuse it
            this._backupedOpen = XMLHttpRequest.prototype.open;
            this._backupedSend = XMLHttpRequest.prototype.send;
            this._backupedSetRequestHeader = XMLHttpRequest.prototype.setRequestHeader;
    
            // Change the reference to the HTMLHttpRequest 'open' method to use the OAuth.JS custom 'open' method 
            // instead            
            XMLHttpRequest.prototype.open = function() {
                
                // Remove the 'callee', 'caller', 'set_callee', 'get_collee', 'set_caller' and 'get_caller' methods
                // This is because the special 'arguments' Javascript object is not an array
                // @see https://developer.mozilla.org/docs/Web/JavaScript/Reference/Fonctions/arguments
                var slicedArguments = [].slice.call(arguments);
                
                var requestContext = new OAuth.RequestContext();
                requestContext.originalXhr.xhr = this;
                requestContext.originalXhr.args.open = slicedArguments;
    
                this.requestContext = requestContext;
                
                // Calls the OAuth.JS 'open' method
                return This._open(requestContext, this, slicedArguments);
                
            };
            
            XMLHttpRequest.prototype.setRequestHeader = function(key, value) {
                
                // Remove the 'callee', 'caller', 'set_callee', 'get_collee', 'set_caller' and 'get_caller' methods
                // This is because the special 'arguments' Javascript object is not an array
                // @see https://developer.mozilla.org/docs/Web/JavaScript/Reference/Fonctions/arguments
                var slicedArguments = [].slice.call(arguments);
                
                this.requestContext.originalXhr.args.setRequestHeader = slicedArguments;
                
                // Calls the OAuth.JS 'setRequestHeader' method
                return This._setRequestHeader(this.requestContext, this, slicedArguments);
                
            };
            
            XMLHttpRequest.prototype.send = function(key, value) {
                
                // Remove the 'callee', 'caller', 'set_callee', 'get_collee', 'set_caller' and 'get_caller' methods
                // This is because the special 'arguments' Javascript object is not an array
                // @see https://developer.mozilla.org/docs/Web/JavaScript/Reference/Fonctions/arguments
                var slicedArguments = [].slice.call(arguments);
                
                this.requestContext.originalXhr.args.send = slicedArguments;
    
                // Calls the OAuth.JS 'setRequestHeader' method
                return This._send(this.requestContext, this, slicedArguments);
                
            };
            
        },
    
        _setRequestHeader : function(requestContext, xhr, slicedArguments) {
            
            this._backupedSetRequestHeader.apply(this._realXhr, slicedArguments);
    
        },
    
        _send : function(requestContext, xhr, slicedArguments) {
    
            this._backupedSend.apply(this._realXhr, slicedArguments);
            
        },
    
        /**
         * Overwritten {@link XMLHttpRequest} open method, this method is a part of what we call the "replaced xhr" object. 
         * The purpose of the replaced xhr is to replace an original {@link XMLHttpRequest} object used by a developer or a 
         * Framework (Backbone, Angular, React, etc.) to intercept server responses and execute actions before returning a 
         * response to the original xhr object.
         * 
         * @param {OAuth.RequestContext} requestContext The {@link RequestContext} object is an object used to keep a trace 
         *        of all the {@link XMLHttpRequest}, parameters and functions used to respond to an original request a 
         *        developer or a Framework (Backbone, Angular, React, etc.) wants to execute.
         * @param {XMLHttpRequest} originalXhr The original {@link XMLHttpRequest} slightly modified to change the behavior 
         *        of some method to let OAuth.JS intercept its actions.
         * @param {Array} openArguments The arguments to pass to the `open()` method of the replaced {@link XMLHttpRequest} 
         *        object.
         */
        // TODO: A tester
        _open : function(requestContext, originalXhr, openArguments) {
    
            // We create an other XMLHttpRequest object to execute the request
            this._realXhr = new XMLHttpRequest();
            this._realXhr.open = this._backupedOpen;
            this._realXhr.send = this._backupedSend;
            this._realXhr.setRequestHeader = this._backupedSetRequestHeader;
    
            this._backupedOpen.apply(this._realXhr, openArguments);
            
            var This = this;
            this._realXhr.onreadystatechange = function() {
                
                // @see https://xhr.spec.whatwg.org/#states
                // The data transfer has been completed or something went wrong during the transfer (e.g. infinite redirects
                // ).
                if(this.readyState === XMLHttpRequest.DONE) {
    
                    // Copy all the XMLHttpRequest attribute of the "replaced xhr" to the "original xhr" to propagate its 
                    // state 
                    OAuth.XhrUtils.copyAttributes(this, originalXhr);
                    
                    // If the request is a protected OAuth 2.0 Resource Request
                    if(originalXhr.isResourceRequest()) {
    
                        // The server returned a 2xx HTTP Response
                        if(this.status >= 200 && this.status < 300) {
                            
                            if(originalXhr.onreadystatechange) { 
                                originalXhr.onreadystatechange();
                            }
                            
                            if(originalXhr.onload) {
                                originalXhr.onload();
                            }
                            
                        } 
                        
                        // The server returned an other HTTP Response
                        else {
        
                            var action = This._parseErrorFn(originalXhr);
        
                            // The error expresses an OAuth 2.0 Access Token Expired
                            if(action === 'refresh') {
        
                                This._refreshAccessToken(requestContext);
        
                            } 
                            
                            // The error expresses an other kind of error which should be notified to the original 
                            // XMLHttpRequest
                            else {
    
                                if(originalXhr.onreadystatechange) { 
                                    originalXhr.onreadystatechange();
                                }
                                
                                if(originalXhr.onload) {
                                    originalXhr.onload();
                                }
    
                            }
        
                        }
                        
                    } 
                    
                    // Otherwise if the request is a request internal to OAuth.JS we simply delegate the 
                    // 'onreadystatechange' call. 
                    // Please note that this is very important to not intercept 'sendCredentials' callbacks in the 
                    // 'parseErrorFn' function
                    else {
    
                        originalXhr.onreadystatechange();
    
                    }
    
                }
                
            };
    
        },
        
        /**
         * Utility function used to update a configuration object passed to the Angular JS `$http(config)` method. The 
         * purpose of this method is to automatically update the URL provided with the arguments to append the OAuth 2.0 
         * 'access_token' URL parameter. The 'access_token' URL parameter is only appended to the URL is the 'secured' 
         * configuration parameter is found.
         * 
         * @param {Object} config A configuration object passed to the Angular JS `$http(config)` method.
         *        
         * @return {Object} The updated configuration object. The provided `config` object is not modified, the returned 
         *         object is a modified copy of the provided `config` object. The returned configuration object has no 
         *         'secured' property because the returned configuration MUST BE 100% compliant with the Angular JS 
         *         framework. The URL could have been updated, this update is only applied if the 'secured' parameter is 
         *         true. If the URL associated to the `config` object already contained an 'access_token' URL parameter then 
         *         its value is updated to the 'access_token' associated to the Storage Manager attached to this Request 
         *         Manager.
         */
        _updateAngularHttpConfig : function(config) {
    
            var updatedConfig = config;
    
            // If the AngularJS $http.get(url, config) is called with a 'config' parameter and this 'config' 
            // parameter indicates the request has to be secured
            if(config.secured === true) {
    
                // Gets the current AuthStatus
                var authStatus = this._storageManager.getAuthStatus();
                
                // Updates the URL to append the 'access_token' parameter
                config.url = OAuth.UrlUtils.addArgument(
                    config.url,
                    'access_token',
                    authStatus.getAccessTokenResponse().getJsonResponse().access_token
                );
    
            }
            
            // Now the 'secured' parameter is not needed anymore, we delete it because its not useful for Angular  
            delete updatedConfig.secured;
            
            return updatedConfig;
    
        }
    
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
        if(OAuth.ObjectUtils.isObject(configuration)) {
    
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
