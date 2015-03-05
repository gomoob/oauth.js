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

    // @include login-context.js
    // @include storage-manager.js
    // @include url-utils.js
    // @include request/angular-request-manager.js
    // @include request/backbone-request-manager.js

    /**
     * Function used to create an OAuth.JS request manager which will overwrite the request function associated to a 
     * specified framework.
     * 
     * @param {string} framework The name of the framework for which one to overwrite the request function.
     * @param {object} settings A settings object used to configure the associated request manager.
     * 
     * @return {OAuth.Request.RequestManager} The created request manager.
     */
    OAuth.init = function(framework, settings) {

        switch(framework) {
            case 'angular':
                OAuth._requestManager = new OAuth.Request.AngularRequestManager(settings);
                break;
            case 'backbone':
                OAuth._requestManager = new OAuth.Request.BackboneRequestManager(settings);
                break;
            default:
                throw new Error('Unknown or unsupported framework \'' + framework + '\' !');
        }

        OAuth._requestManager.start();

    };

    OAuth.login = function(cb, opts) {
    
        OAuth._requestManager.login(cb, opts);

    };

    return OAuth;

}));
