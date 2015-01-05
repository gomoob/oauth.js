// To use jQuery inside Node
var env = require('jsdom').env, 
    html = '<html><body><h1>Hello World!</h1><p class="hello">Heya Big World!</body></html>';

env(
    html, 
    function (errors, window) {
        
        var $ = require('jquery')(window);

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
                
                it('should add access token parameter', function() {
                    
                    Backbone = {
                        ajax : function() {},
                        $ : {
                            ajax : function(args) {
        
                                // Here is what we expect
                                expect(args).to.have.a.property('url');
                                expect(args.url).to.equal('http://test.com?access_token=ACCESS_TOKEN');
                                
                                return {
                                    fail : function(callback) {},
                                    success : function(callback) {}
                                };
                            }
                        }
                    };
                    
                    var requestManager = new BackboneRequestManager();
                    requestManager.getStorageManager().persistRawAccessTokenResponse(
                        '{' + 
                            '"access_token" : "ACCESS_TOKEN",' +
                            '"token_type" : "bearer",' + 
                            '"expires_in" : "3600",' + 
                            '"scope" : "scope1,scope2,scope3",' + 
                            '"state" : "state"' + 
                        '}'
                    );
                    requestManager.start();
                    
                    Backbone.ajax({
                        url : 'http://test.com'
                    });
                    
                });
                
            });
            
        });

    }

);