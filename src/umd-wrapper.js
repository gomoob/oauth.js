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
           * @namespace OAuth.AccessToken
           */
          AccessToken : {},

          /**
           * @namespace OAuth.Request
           */
          Request : {},

          /**
           * @namespace OAuth.Storage
           */
          Storage : {}

    };

    // @include xmlhttprequest/XMLHttpRequest.js

    // @include abnf-utils.js
    // @include auth-status.js
    // @include function-utils.js
    // @include login-context.js
    // @include object-utils.js
    // @include promise.js
    // @include request-context.js
    // @include url-utils.js
    // @include xhr-utils.js

    // @include access-token/abstract-response.js
    // @include access-token/critical-error-response.js
    // @include access-token/error-response.js
    // @include access-token/response-parser.js
    // @include access-token/successful-response.js

    // @include storage/web-storage.js

    // @include request/abstract-request-manager.js
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

    // TODO: Ajouter la méthode 'getAuthResponse()'
    //       @see https://developers.facebook.com/docs/reference/javascript/FB.getAuthResponse

    OAuth.getLoginStatus = function(cb, forceServerCall) {

        return OAuth._requestManager.getLoginStatus(cb, forceServerCall);

    };

    /**
     * Function used to login a user.
     *
     * @param cb A callback function to be called when a login action has been done.
     * @param opts Options used to configure the login.
     */
    // FIXME: A renommer en 'requireConnection' ou 'secured()' ou 'authorized()', etc...
    OAuth.login = function(cb, opts) {

        return OAuth._requestManager.login(cb, opts);

    };

    /**
     * Function used to logout a user.
     *
     * @param cb A callback to be called after the logout is done.
     */
    OAuth.logout = function(cb) {

        return OAuth._requestManager.logout(cb);

    };

    // FIXME: A renommer en 'login' (Pas sûr que ce soit bien car on est pas vraiment identique au SDK Facebook ici).
    OAuth.sendCredentials = function(credentials, cb, opts) {

        return OAuth._requestManager.sendCredentials(credentials, cb, opts);

    };

    return OAuth;

}));
