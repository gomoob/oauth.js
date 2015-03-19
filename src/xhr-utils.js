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