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