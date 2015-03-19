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

OAuth = require((process.env.APP_DIR_FOR_CODE_COVERAGE || '../../src/') + 'umd-wrapper');
require((process.env.APP_DIR_FOR_CODE_COVERAGE || '../../src/') + 'abnf-utils');
require((process.env.APP_DIR_FOR_CODE_COVERAGE || '../../src/') + 'login-context');
require((process.env.APP_DIR_FOR_CODE_COVERAGE || '../../src/') + 'promise');
require((process.env.APP_DIR_FOR_CODE_COVERAGE || '../../src/') + 'storage-manager');
require((process.env.APP_DIR_FOR_CODE_COVERAGE || '../../src/') + 'function-utils');
require((process.env.APP_DIR_FOR_CODE_COVERAGE || '../../src/') + 'url-utils');

// OAuth.AccessToken namespace
require((process.env.APP_DIR_FOR_CODE_COVERAGE || '../../src/') + 'access-token/abstract-response');
require((process.env.APP_DIR_FOR_CODE_COVERAGE || '../../src/') + 'access-token/critical-error-response');
require((process.env.APP_DIR_FOR_CODE_COVERAGE || '../../src/') + 'access-token/error-response');
require((process.env.APP_DIR_FOR_CODE_COVERAGE || '../../src/') + 'access-token/response-parser');
require((process.env.APP_DIR_FOR_CODE_COVERAGE || '../../src/') + 'access-token/successful-response');

// OAuth.Request namespace
require((process.env.APP_DIR_FOR_CODE_COVERAGE || '../../src/') + 'request/abstract-request-manager');
require((process.env.APP_DIR_FOR_CODE_COVERAGE || '../../src/') + 'request/angular-request-manager');
require((process.env.APP_DIR_FOR_CODE_COVERAGE || '../../src/') + 'request/backbone-request-manager');
