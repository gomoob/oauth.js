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