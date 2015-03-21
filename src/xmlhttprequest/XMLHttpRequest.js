(function () {
    
    //@see https://xhr.spec.whatwg.org
    window.OXMLHttpRequest = window.XMLHttpRequest;
    
    window.XMLHttpRequest = function() {
        
        this.DONE = 4;
        this.HEADERS_RECEIVED = 2;
        this.LOADING = 3;
        this.OPENED = 1;
        this.UNSENT = 0;
        
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

    };

    window.XMLHttpRequest.prototype = {};
    window.XMLHttpRequest.prototype.abort = function() {
        return this.oXMLHttpRequest.abort();
    };
    window.XMLHttpRequest.prototype.open = function(sMethod, sUrl, bAsync, sUser, sPassword) {
        return this.oXMLHttpRequest.open(sMethod, sUrl, bAsync, sUser, sPassword);
    };
    window.XMLHttpRequest.prototype.overrideMimeType = function(mime) {
        return this.oXMLHttpRequest.overrideMimeType(mime);
    };
    window.XMLHttpRequest.prototype.send = function(data) {
        return this.oXMLHttpRequest.send(data);
    };
    window.XMLHttpRequest.prototype.getAllResponseHeaders = function() {
        return this.oXMLHttpRequest.getAllResponseHeaders();
    };
    window.XMLHttpRequest.prototype.getResponseHeader = function(name) {
        return this.oXMLHttpRequest.getResponseHeader(name);
    };
    window.XMLHttpRequest.prototype.setRequestHeader  = function(name, value) {
        return this.oXMLHttpRequest.setRequestHeader(name, value);
    };

})();