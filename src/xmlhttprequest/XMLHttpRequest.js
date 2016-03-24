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

        // Create an original XMLHttpRequest (i.e the XMLHttpRequest object implementation of the Browser in use) to
        // delegate calls.
        this.oXMLHttpRequest = new OXMLHttpRequest(); 

        /**
         * The 'onabort' callback wired on the modified XMLHttpRequest class is called when the 'onabort' callback of 
         * the original XMLHttpRequest object is called.
         * 
         * @param {ProgressEvent} progressEvent The encountered progress event.
         * 
         * @see https://xhr.spec.whatwg.org/#progressevent
         * @see https://www.w3.org/TR/XMLHttpRequest/#events
         */
        this.oXMLHttpRequest.onabort = function(progressEvent) {
        	
        	// If the 'onabort' callback is defined on the modified XMLHttpRequest class we call it
            if(This.onabort) {
                This.onabort(progressEvent);
            }

        };
        
        /**
         * The 'onerror' callback wired on the modified XMLHttpRequest class is called when the 'onerror' callback of 
         * the original XMLHttpRequest object is called.
         * 
         * @param {ProgressEvent} progressEvent The encountered progress event.
         * 
         * @see https://xhr.spec.whatwg.org/#progressevent
         * @see https://www.w3.org/TR/XMLHttpRequest/#events
         */
        this.oXMLHttpRequest.onerror = function(progressEvent) {
        	
        	// If the 'onerror' callback is defined on the modified XMLHttpRequest class we call it
            if(This.onerror) {
                This.onerror(progressEvent);
            }

        };
        
        /**
         * The 'onload' callback wired on the modified XMLHttpRequest class is called when the 'onload' callback of 
         * the original XMLHttpRequest object is called.
         * 
         * @param {ProgressEvent} progressEvent The encountered progress event.
         * 
         * @see https://xhr.spec.whatwg.org/#progressevent
         * @see https://www.w3.org/TR/XMLHttpRequest/#events
         */
        this.oXMLHttpRequest.onload = function(progressEvent) {
        	
        	// If the 'onload' callback is defined on the modified XMLHttpRequest class we call it
            if(This.onload) {
                This.onload(progressEvent);
            }

        };
        
        /**
         * The 'onloadend' callback wired on the modified XMLHttpRequest class is called when the 'onloadend' callback 
         * of the original XMLHttpRequest object is called.
         * 
         * @param {ProgressEvent} progressEvent The encountered progress event.
         * 
         * @see https://xhr.spec.whatwg.org/#progressevent
         * @see https://www.w3.org/TR/XMLHttpRequest/#events
         */
        this.oXMLHttpRequest.onloadend = function(progressEvent) {
        	
        	// If the 'onloadend' callback is defined on the modified XMLHttpRequest class we call it
            if(This.onloadend) {
                This.onloadend(progressEvent);
            }

        };
        
        /**
         * The 'onloadstart' callback wired on the modified XMLHttpRequest class is called when the 'onloadstart' 
         * callback of the original XMLHttpRequest object is called.
         * 
         * @param {ProgressEvent} progressEvent The encountered progress event.
         * 
         * @see https://xhr.spec.whatwg.org/#progressevent
         * @see https://www.w3.org/TR/XMLHttpRequest/#events
         */
        this.oXMLHttpRequest.onloadstart = function(progressEvent) {
        	
        	// If the 'onloadstart' callback is defined on the modified XMLHttpRequest class we call it
            if(This.onloadstart) {
                This.onloadstart(progressEvent);
            }

        };
        
        /**
         * The 'onprogress' callback wired on the modified XMLHttpRequest class is called when the 'onprogress' 
         * callback of the original XMLHttpRequest object is called.
         * 
         * @param {ProgressEvent} progressEvent The encountered progress event.
         * 
         * @see https://xhr.spec.whatwg.org/#progressevent
         * @see https://www.w3.org/TR/XMLHttpRequest/#events
         */
        this.oXMLHttpRequest.onprogress = function(progressEvent) {
            if(This.onprogress) {
                This.onprogress(progressEvent);
            }
        };

        /**
         * The 'onreadystatechange' callback wired on the modified XMLHttpRequest class is called when the
         * 'onreadystatechange' callback of the original XMLHttpRequest object is called.
         * 
         * @param {ProgressEvent} progressEvent The encountered progress event.
         * 
         * @see https://xhr.spec.whatwg.org/#progressevent
         * @see https://www.w3.org/TR/XMLHttpRequest/#events
         */
        this.oXMLHttpRequest.onreadystatechange = function(event) {
            
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
                This.onreadystatechange(event);
            }
        };

        /**
         * The 'ontimeout' callback wired on the modified XMLHttpRequest class is called when the
         * 'ontimeout' callback of the original XMLHttpRequest object is called.
         * 
         * @param {ProgressEvent} progressEvent The encountered progress event.
         * 
         * @see https://xhr.spec.whatwg.org/#progressevent
         * @see https://www.w3.org/TR/XMLHttpRequest/#events
         */
        this.oXMLHttpRequest.ontimeout = function(progressEvent) {
            if(This.ontimeout) {
                This.ontimeout(progressEvent);
            }
        };

        ////////////////////////////////////////////////////////////////////////////////////////////////////////////////
        // Initial XMLHttpRequest state
        ////////////////////////////////////////////////////////////////////////////////////////////////////////////////
        this.readyState = 0;
        this.response = '';
        this.responseText = '';
        this.responseType = '';
        this.responseURL = '';
        this.responseXML = null;
        this.status = 0;
        this.statusText = '';
        this.timeout = 0;
        this.withCredentials = false;
        this.upload = this.oXMLHttpRequest.upload; // This is important otherwise upload progress will not work

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