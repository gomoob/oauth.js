var sinon = require('sinon');
var chai = require('chai');
var sinonChai = require('sinon-chai');

chai.use(sinonChai);

global.expect = chai.expect;
global.sinon = sinon;

global.slice = Array.prototype.slice;

// Used to emulate browser local storage in node
if (typeof localStorage === 'undefined' || localStorage === null) {

    var LocalStorage = require('node-localstorage').LocalStorage;
    localStorage = new LocalStorage('./node-localstorage');
    
    // see: http://www.w3schools.com/html/html5_webstorage.asp
    Storage = {};

}

require((process.env.APP_DIR_FOR_CODE_COVERAGE || '../../src/') + 'error-parser');
require((process.env.APP_DIR_FOR_CODE_COVERAGE || '../../src/') + 'storage-manager');

require((process.env.APP_DIR_FOR_CODE_COVERAGE || '../../src/') + 'request/backbone-request-manager');
