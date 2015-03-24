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