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
require((process.env.APP_DIR_FOR_CODE_COVERAGE || '../../src/') + 'login-context');
require((process.env.APP_DIR_FOR_CODE_COVERAGE || '../../src/') + 'storage-manager');
require((process.env.APP_DIR_FOR_CODE_COVERAGE || '../../src/') + 'function-utils');
require((process.env.APP_DIR_FOR_CODE_COVERAGE || '../../src/') + 'url-utils');
require((process.env.APP_DIR_FOR_CODE_COVERAGE || '../../src/') + 'request/abstract-request-manager');
require((process.env.APP_DIR_FOR_CODE_COVERAGE || '../../src/') + 'request/angular-request-manager');
require((process.env.APP_DIR_FOR_CODE_COVERAGE || '../../src/') + 'request/backbone-request-manager');
