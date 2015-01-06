// To use jQuery inside Node
var env = require('jsdom').env, 
    html = '<html><body><h1>Hello World!</h1><p class="hello">Heya Big World!</body></html>';

env(
    html, 
    function (errors, window) {
        
        $ = require('jquery')(window);
        jQuery = $;

        beforeEach(function() {
            
            Backbone = require('backbone');
            
        });

        describe('BackboneRequestManager :', function() {
            
            describe('upon initialization', function() {
               
                it('should have Backbone defined', function() {
                    
                    Backbone = undefined;
                    
                    expect(BackboneRequestManager).to.throw(
                        Error, 
                        'Backbone is not available !'
                    );
                    
                });
                
                it('should have Backbone.ajax defined', function() {
                    
                    Backbone = {};
                    
                    expect(BackboneRequestManager).to.throw(
                        Error, 
                        'No valid \'Backbone.ajax\' method has been found !'
                    );
                    
                    Backbone = undefined;
        
                });
                
                it('should have a valid Backbone.ajax function defined', function() {
                    
                    Backbone = {
                        ajax : {}
                    };
                    
                    expect(BackboneRequestManager).to.throw(
                        Error, 
                        'No valid \'Backbone.ajax\' method has been found !'
                    );
                    
                    Backbone = undefined;
        
                });
                
            });
            
            describe('after start', function() {
                
                it('should overwrite the Backbone.ajax method', function() {
                    
                    var backupedBackboneAjax = Backbone.ajax;

                    var requestManager = new BackboneRequestManager();
                    requestManager.start();
                    
                    expect(Backbone.ajax).to.not.equal(backupedBackboneAjax);
                    
                });
                
            });
            
            describe('on request', function() {
                
                before(function() {
                    
                    sinon.spy($, "ajax");
                    Backbone.$ = $;

                });
                
                it('should add access token parameter', function() {

                    var requestManager = new BackboneRequestManager();
                    requestManager.getStorageManager().persistRawAccessTokenResponse(
                        '{"access_token" : "ACCESS_TOKEN"}'
                    );
                    requestManager.start();

                    // Test with a URL directly provided
                    Backbone.ajax('http://test1.com');
                    expect($.ajax.calledOnce).to.be.true();
                    expect($.ajax.getCall(0).args[0]).to.equal('http://test1.com?access_token=ACCESS_TOKEN');
                    
                    // Test with a URL provided in a configuration object
                    Backbone.ajax({ url : 'http://test2.com' });
                    expect($.ajax.calledTwice).to.be.true();
                    expect($.ajax.getCall(1).args[0].url).to.equal('http://test2.com?access_token=ACCESS_TOKEN');
                    
                });
                
                after(function() {
                    
                    $.ajax.restore();
                    Backbone.$ = $;
                    
                });
                
            });
            
            describe('on successful request', function() {
                
                // A jQuery Deferred object used to simulate an AJAX request on a Web Service
                var ajaxDeferred = $.Deferred();
                
                before(function() {
                    sinon.stub($, 'ajax').returns(ajaxDeferred);
                    Backbone.$ = $;
                });
                
                it('should resolve the oauth promise', function(done) {
                    
                    var requestManager = new BackboneRequestManager();
                    requestManager.getStorageManager().persistRawAccessTokenResponse('{"access_token":"ACCESS_TOKEN"}');
                    requestManager.start();
                    
                    var oauthPromise = Backbone.ajax('http://test1.com');
                    oauthPromise.done(function(data, textStatus, jqXHR) {

                        // The parameters passed to the done() method should be the same as the parameters passed to the 
                        // jQuery AJAX promise done() method
                        expect(data).to.equal('data');
                        expect(textStatus).to.equal('textStatus');
                        expect(jqXHR).to.equal('jqXHR');

                        // Ok the test is successful
                        done();
                        
                    });
                    oauthPromise.fail(function(jqXHR, textStatus, errorThrown) {
                        
                        expect('Should not have called fail !').to.be.false();
                        
                    });

                    // Simulates the AJAX request server response (this should trigger an execution of the OAuth promise 
                    // done() method).
                    ajaxDeferred.resolve('data', 'textStatus', 'jqXHR');

                });
                
                after(function() {
                    
                    $.ajax.restore();
                    Backbone.$ = $;
                    
                });
                
            });
            
            describe('on not OAuth 2.0 error request', function() {
                
                // A jQuery Deferred object used to simulate an AJAX request on a Web Service
                var ajaxDeferred = $.Deferred();
                
                before(function() {
                    sinon.stub($, 'ajax').returns(ajaxDeferred);
                    Backbone.$ = $;
                });
                
                it('should reject the oauth promise', function(done) {
                    
                    var requestManager = new BackboneRequestManager();
                    requestManager.getStorageManager().persistRawAccessTokenResponse('{"access_token":"ACCESS_TOKEN"}');
                    requestManager.start();
                    
                    var oauthPromise = Backbone.ajax('http://test1.com');
                    oauthPromise.done(function(data, textStatus, jqXHR) {

                        expect('Should not have called done !').to.be.false();
                        
                    });
                    oauthPromise.fail(function(jqXHR, textStatus, errorThrown) {
                        
                        // The parameters passed to the fail() method should be the same as the parameters passed to the 
                        // jQuery AJAX promise fail() method
                        expect(jqXHR).to.equal('jqXHR');
                        expect(textStatus).to.equal('textStatus');
                        expect(errorThrown).to.equal('errorThrown');

                        // Ok the test is successful
                        done();
                        
                    });
                    
                    // Simulates the AJAX request server response (this should trigger an execution of the OAuth promise 
                    // fail() method).
                    ajaxDeferred.reject('jqXHR', 'textStatus', 'errorThrown');

                });
                
                after(function() {
                    
                    $.ajax.restore();
                    Backbone.$ = $;
                    
                });
                
            });
            
            describe('on expired token OAuth 2.0 error and successful token refresh', function(done) {
                
                // A jQuery Deferred object used to simulate an AJAX request on a Web Service
                var ajaxDeferred = $.Deferred(), 
                    ajaxDeferred2 = $.Deferred(), 
                    ajaxDeferred3 = $.Deferred();
                var clock = null;
                
                before(function() {
                    
                    var ajaxStub = sinon.stub($, 'ajax');
                    ajaxStub.onCall(0).returns(ajaxDeferred);
                    ajaxStub.onCall(1).returns(ajaxDeferred2);
                    ajaxStub.onCall(2).returns(ajaxDeferred3);
                    Backbone.$ = $;
                    
                    clock = sinon.useFakeTimers();
                });
                
                it('should refresh the OAuth 2.0 token and retry the original request', function(done) {
                    
                    var requestManager = new BackboneRequestManager();
                    requestManager.getStorageManager().persistRawAccessTokenResponse(
                        '{' + 
                            '"access_token":"ACCESS_TOKEN",' + 
                            '"refresh_token":"REFRESH_TOKEN"' + 
                        '}'
                    );
                    requestManager.start();
                    
                    var oauthPromise = Backbone.ajax('http://test1.com');
                    oauthPromise.done(function(data, textStatus, jqXHR) {
                        
                        expect(data).to.equal('ws_data');
                        expect(textStatus).to.equal('ws_textStatus');
                        expect(jqXHR).to.equal('ws_jqXHR');
                        
                        done();
                        
                    });
                    oauthPromise.fail(function() {
                        
                        expect('Should not have called fail !').to.be.false();
                    
                    });
                    
                    console.log('First ajax request...');
                    
                    ajaxDeferred.reject(
                        {
                            status : 401,
                            responseText : 'token_expired'
                        },
                        'textStatus', 
                        'errorThrown'
                    );
                    
                    clock.tick(1);
                    
                    console.log('Second ajax request...');
                    
                    ajaxDeferred2.resolve('a', 'b', 'c');
                    
                    clock.tick(1);
                    
                    ajaxDeferred3.resolve(
                        'ws_data', 
                        'ws_textStatus', 
                        'ws_jqXHR'
                    );

                });
                
                after(function() {
                    
                    $.ajax.restore();
                    Backbone.$ = $;
                    
                    clock.restore();
                    
                });
                
            });
            
        });

    }

);