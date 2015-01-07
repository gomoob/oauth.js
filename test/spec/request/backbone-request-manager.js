// To use jQuery inside Node
var env = require('jsdom').env, 
    html = '<html><body><h1>Hello World!</h1><p class="hello">Heya Big World!</body></html>';

env(
    html, 
    function (errors, window) {
        
        // Initialize jQuery for the tests
        $ = require('jquery')(window);
        jQuery = $;

        beforeEach(function() {

            Backbone = require('backbone');
            
        });

        describe('OAuth.Request.BackboneRequestManager :', function() {
            
            describe('upon initialization', function() {
               
                it('should have Backbone defined', function() {
                    
                    Backbone = undefined;
                    
                    expect(OAuth.Request.BackboneRequestManager).to.throw(
                        Error, 
                        'Backbone is not available !'
                    );
                    
                });
                
                it('should have Backbone.ajax defined', function() {
                    
                    Backbone = {};
                    
                    expect(OAuth.Request.BackboneRequestManager).to.throw(
                        Error, 
                        'No valid \'Backbone.ajax\' method has been found !'
                    );
                    
                    Backbone = undefined;
        
                });
                
                it('should have a valid Backbone.ajax function defined', function() {
                    
                    Backbone = {
                        ajax : {}
                    };
                    
                    expect(OAuth.Request.BackboneRequestManager).to.throw(
                        Error, 
                        'No valid \'Backbone.ajax\' method has been found !'
                    );
                    
                    Backbone = undefined;
        
                });
                
                it('should provide a configuration object', function() {
                    
                    expect(
                        function() { 
                            return new OAuth.Request.BackboneRequestManager(); 
                        }
                    ).to.throw(
                        Error, 
                        'A configuration object is required !'
                    );
                    
                });
                
                if('should provide a configuration object with a credentials getter', function() {
                    
                    expect(
                        function() {
                            return new OAuth.Request.BackboneRequestManager(
                                {
                                    tokenEndpoint : 'http://test.com/token'
                                }
                            );
                        }
                    ).to.throw(
                        Error, 
                        'No credentials getter is provided !'
                    );
                    
                });
                
                it('should provide a configuration object with a token endpoint', function() {
                    
                    expect(
                        function() { 
                            return new OAuth.Request.BackboneRequestManager({ credentialsGetter : {} }); 
                        }
                    ).to.throw(
                        Error, 
                        'No token endpoint is provided or its valued is invalid !'
                    );
                    
                });
                
            });
            
            describe('after start', function() {
                
                it('should overwrite the Backbone.ajax method', function() {
                    
                    var backupedBackboneAjax = Backbone.ajax;

                    var requestManager = new OAuth.Request.BackboneRequestManager(
                        {
                            credentialsGetter : {},
                            tokenEndpoint : 'https://test.com/token'
                        }
                    );
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

                    var requestManager = new OAuth.Request.BackboneRequestManager(
                        {
                            credentialsGetter : {},
                            tokenEndpoint : 'https://test.com/token'
                        }
                    );
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
                    
                    var requestManager = new OAuth.Request.BackboneRequestManager(
                        {
                            credentialsGetter : {},
                            tokenEndpoint : 'https://test.com/token'
                        }
                    );
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
                    
                    var requestManager = new OAuth.Request.BackboneRequestManager(
                        {
                            credentialsGetter : {},
                            tokenEndpoint : 'https://test.com/token'
                        }
                    );
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
                
                // We create 3 different jQuery Deferred object for our test
                //  - The first one is used to simulate the original Web Service request
                //  - The second one is used to simulate the token refresh request
                //  - The third one is used to simulate the replayed original Web Service request
                var ajaxDeferred1 = $.Deferred(), 
                    ajaxDeferred2 = $.Deferred(), 
                    ajaxDeferred3 = $.Deferred();
                var clock = null;
                
                before(function() {
                    
                    var ajaxStub = sinon.stub($, 'ajax');
                    ajaxStub.onCall(0).returns(ajaxDeferred1);
                    ajaxStub.onCall(1).returns(ajaxDeferred2);
                    ajaxStub.onCall(2).returns(ajaxDeferred3);
                    Backbone.$ = $;
                    
                    clock = sinon.useFakeTimers();
                });
                
                it('should refresh the OAuth 2.0 token and retry the original request', function(done) {
                    
                    var requestManager = new OAuth.Request.BackboneRequestManager(
                        {
                            credentialsGetter : {},
                            tokenEndpoint : 'https://test.com/token'
                        }
                    );
                    requestManager.getStorageManager().persistRawAccessTokenResponse(
                        '{' + 
                            '"access_token":"ACCESS_TOKEN",' + 
                            '"refresh_token":"REFRESH_TOKEN"' + 
                        '}'
                    );
                    requestManager.start();
                    
                    // At the beginning we have specific OAuth 2.0 Access and Refresh tokens in the client storage, this 
                    // test should change them.
                    expect(requestManager.getStorageManager().getAccessToken()).to.equal('ACCESS_TOKEN');
                    expect(requestManager.getStorageManager().getRefreshToken()).to.equal('REFRESH_TOKEN');

                    // Calls our test Web Service, this one will return to token expired error
                    var oauthPromise = Backbone.ajax('http://test1.com');
                    oauthPromise.done(function(data, textStatus, jqXHR) {
                        
                        // Checks that the OAuth 2.0 Access and Refresh tokens have been update in the client storage
                        expect(requestManager.getStorageManager().getAccessToken()).to.equal('ACCESS_TOKEN_2');
                        expect(requestManager.getStorageManager().getRefreshToken()).to.equal('REFRESH_TOKEN_2');
                        
                        expect(data).to.equal('ws_data');
                        expect(textStatus).to.equal('ws_textStatus');
                        expect(jqXHR).to.equal('ws_jqXHR');
                        
                        done();
                        
                    });
                    oauthPromise.fail(function() {
                        
                        expect('Should not have called fail !').to.be.false();
                    
                    });
                    
                    // Simulates the response of the original Web Service request, here the response indicates that the 
                    // OAuth 2.0 Access Token is expired
                    ajaxDeferred1.reject(
                        {
                            status : 401,
                            responseText : 'token_expired'
                        },
                        'textStatus', 
                        'errorThrown'
                    );
                    
                    clock.tick(1);
                    
                    // Simulates the response of the token refresh request
                    ajaxDeferred2.resolve(
                        {
                            access_token : 'ACCESS_TOKEN_2', 
                            refresh_token : 'REFRESH_TOKEN_2'
                        },
                        'token_refresh_textStatus',
                        'token_refresh_jqXHR'
                    );

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
        
//        describe('on expired token OAuth 2.0 error and error token refresh', function() {
//            
//        });
//        
        describe('on invalid token OAuth 2.0 error and successful token reniewal', function() {
            
            // We create 3 different jQuery Deferred object for our test
            //  - The first one is used to simulate the original Web Service request
            //  - The second one is used to simulate the token refresh request
            //  - The third one is used to simulate the replayed original Web Service request
            var ajaxDeferred1 = $.Deferred(), 
                ajaxDeferred2 = $.Deferred(), 
                ajaxDeferred3 = $.Deferred();
            var clock = null;
            
            before(function() {
                
                var ajaxStub = sinon.stub($, 'ajax');
                ajaxStub.onCall(0).returns(ajaxDeferred1);
                ajaxStub.onCall(1).returns(ajaxDeferred2);
                ajaxStub.onCall(2).returns(ajaxDeferred3);
                Backbone.$ = $;

                clock = sinon.useFakeTimers();

            });
            
            it('should reniew the OAuth 2.0 token and retry the original request', function(done) {
                
                var credentialsGetterDeferred = $.Deferred();
                
                var requestManager = new OAuth.Request.BackboneRequestManager(
                    {
                        credentialsGetter : {
                            getCredentials : function(credentialsPromise) {
                                
                                credentialsGetterDeferred.done(function(username, password) {
                                    
                                    credentialsPromise.resolve(
                                        {
                                            grant_type : 'password',
                                            username : username,
                                            password : password
                                        }
                                    );
                                    
                                });
                                
                            }
                        },
                        tokenEndpoint : 'https://test.com/token'
                    }
                );
                requestManager.getStorageManager().persistRawAccessTokenResponse(
                    '{' + 
                        '"access_token":"ACCESS_TOKEN",' + 
                        '"refresh_token":"REFRESH_TOKEN"' + 
                    '}'
                );
                requestManager.start();
                
                // At the beginning we have specific OAuth 2.0 Access and Refresh tokens in the client storage, this 
                // test should change them.
                expect(requestManager.getStorageManager().getAccessToken()).to.equal('ACCESS_TOKEN');
                expect(requestManager.getStorageManager().getRefreshToken()).to.equal('REFRESH_TOKEN');
                
                // Calls our test Web Service, this one will return to token expired error
                var oauthPromise = Backbone.ajax('http://test1.com');
                oauthPromise.done(function(data, textStatus, jqXHR) {
                    
                    // Checks that the OAuth 2.0 Access and Refresh tokens have been update in the client storage
                    expect(requestManager.getStorageManager().getAccessToken()).to.equal('ACCESS_TOKEN_2');
                    expect(requestManager.getStorageManager().getRefreshToken()).to.equal('REFRESH_TOKEN_2');
                    
                    expect(data).to.equal('ws_data');
                    expect(textStatus).to.equal('ws_textStatus');
                    expect(jqXHR).to.equal('ws_jqXHR');
                    
                    done();
                    
                });
                oauthPromise.fail(function() {
                    
                    expect('Should not have called fail !').to.be.false();
                
                });
                
                // Simulates the response of the original Web Service request, here the response indicates that the 
                // OAuth 2.0 Access Token is invalid
                ajaxDeferred1.reject(
                    {
                        status : 401,
                        responseText : 'token_invalid'
                    },
                    'textStatus',
                    'errorThrown'
                );
                
                clock.tick(1);
                
                // Simulates the username / password form fill
                credentialsGetterDeferred.resolve('john', 'doe');
                
                clock.tick(1);
                
                // Simulates the response of the OAauth 2.0 Access Token reniewal
                ajaxDeferred2.resolve(
                    {
                        access_token : 'ACCESS_TOKEN_2', 
                        refresh_token : 'REFRESH_TOKEN_2'
                    },
                    'token_reniewal_textStatus',
                    'token_reniewal_jqXHR'
                );
                
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

    }

);