var fs = require('fs'),
    path = require('path');

var sinon = require('sinon');
var chai = require('chai');
var sinonChai = require('sinon-chai');

chai.use(sinonChai);

global.expect = chai.expect;
global.sinon = sinon;

global.slice = Array.prototype.slice;

// Define Node XHMLHttpRequest for the tests
global.XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;

// Used to emulate browser local storage in node
if (typeof localStorage === 'undefined' || localStorage === null) {

    var LocalStorage = require('node-localstorage').LocalStorage;
    localStorage = new LocalStorage('./node-localstorage');
    
    // see: http://www.w3schools.com/html/html5_webstorage.asp
    Storage = {};

}

OAuth = require('../../src/umd-wrapper');

var blanket = require('blanket')({
    pattern : [
        path.resolve(__dirname + '/../../src/abnf-utils.js'),
        path.resolve(__dirname + '/../../src/auth-status.js'),
        path.resolve(__dirname + '/../../src/login-context.js'),
        path.resolve(__dirname + '/../../src/object-utils.js'),
        path.resolve(__dirname + '/../../src/promise.js'),
        path.resolve(__dirname + '/../../src/storage-manage.js'),
        path.resolve(__dirname + '/../../src/function-utils.js'),
        
        // FIXME: Syntax errors on those 2 files
        // path.resolve(__dirname + '/../../src/url-utils.js'),
        // path.resolve(__dirname + '/../../src/xhr-utils.js'),

        // OAuth.AccessToken namespace
        path.resolve(__dirname + '/../../src/access-token/abstract-response'),
        path.resolve(__dirname + '/../../src/access-token/critical-error-response'),
        path.resolve(__dirname + '/../../src/access-token/error-response'),
        path.resolve(__dirname + '/../../src/access-token/response-parser'),
        path.resolve(__dirname + '/../../src/access-token/successful-response'),
        
        // OAuth.Request namespace
        path.resolve(__dirname + '/../../src/request/abstract-request-manager'),
        path.resolve(__dirname + '/../../src/request/angular-request-manager'),
        path.resolve(__dirname + '/../../src/request/backbone-request-manager')
    ]
});

require('../../src/abnf-utils');
require('../../src/auth-status');
require('../../src/login-context');
require('../../src/object-utils');
require('../../src/promise');
require('../../src/storage-manager');
require('../../src/function-utils');
require('../../src/url-utils');
require('../../src/xhr-utils');

// OAuth.AccessToken namespace
require('../../src/access-token/abstract-response');
require('../../src/access-token/critical-error-response');
require('../../src/access-token/error-response');
require('../../src/access-token/response-parser');
require('../../src/access-token/successful-response');

// OAuth.Request namespace
require('../../src/request/abstract-request-manager');
require('../../src/request/angular-request-manager');
require('../../src/request/backbone-request-manager');
