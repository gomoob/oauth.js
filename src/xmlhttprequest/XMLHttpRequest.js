(function () {

    //@see https://xhr.spec.whatwg.org
    var OXMLHttpRequest = window.XMLHttpRequest;
    
    window.XMLHttpRequest = function() {
        
        return new OXMLHttpRequest();
    };

})();
