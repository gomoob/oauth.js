/**
 * Class which represents a Request Context, a request context is an object which transports informations about an 
 * OAuth.JS request.
 * 
 * @author Baptiste GAILLARD (baptiste.gaillard@gomoob.com)
 * @class RequestContext
 * @memberof OAuth
 */
OAuth.RequestContext = function() {
    
    this.originalXhr = {
        xhr : null, 
        args : {
            open : null,
            send : null,
            setRequestHeader : null
        }
    };
    
};