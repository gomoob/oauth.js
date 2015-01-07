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
           * @namespace Editor.Error
           */
          Error : {},
                  
          /**
           * @namespace Editor.Request
           */
          Request : {}

    };
    
    // @include storage-manager.js
    // @include error/default-error-parser.js
    // @include request/angular-request-manager.js
    // @include request/backbone-request-manager.js

    OAuth.createRequestManager = function(clientType, settings) {
        
        var requestManager = null;
        
        switch(clientType) {
            case 'angular':
                requestManager = new OAuth.Request.AngularRequestManager(settings);
                break;
            case 'backbone':
                requestManager = new OAuth.Request.BackboneRequestManager(settings);
                break;
            default:
                throw new Error('Unknown or unsupported client type \'' + clientType + '\' !');
        }
        
        return requestManager;

    };
    
    return OAuth;

}));
