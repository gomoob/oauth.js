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