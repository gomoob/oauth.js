/*jshint -W030 */

describe('OAuth.AuthStatus : ', function() {
    
    describe('When calling the constructor with bad parameters', function() {
        
        it('should throw an error', function() {
    
            // Test with no settings object
            expect(function() {
                return new OAuth.AuthStatus();
            }).to.throw(
                Error, 
                'This object must be initialized with a settings object !'
            );
            
            // Test with a settings object of bad type
            expect(function() {
                return new OAuth.AuthStatus('bad_type');
            }).to.throw(
                Error, 
                'This object must be initialized with a settings object !'
            );
            
            // Test with a settings object attached to no status
            expect(function() {
                return new OAuth.AuthStatus({});
            }).to.throw(
                Error, 
                'The settings object has no status property or an invalid status property !'
            );
            
            // Test with a settings object attached to a bad status
            expect(function() {
                return new OAuth.AuthStatus({ status : 'invalid' });
            }).to.throw(
                Error, 
                'The settings object has no status property or an invalid status property !'
            );
            
            // Test with a settings object with no accessTokenReponse
            expect(function() {
                return new OAuth.AuthStatus(
                    { 
                        status : 'connected' 
                    }
                );
            }).to.throw(
                Error, 
                'The settings object has not access token response object or an invalid access token response object !'
            );
            
            // Test with a settings object attached to a bad accessTokenResponse
            expect(function() {
                return new OAuth.AuthStatus(
                    { 
                        status : 'connected',
                        accessTokenResponse : 'bad_type'
                    }
                );
            }).to.throw(
                Error, 
                'The settings object has not access token response object or an invalid access token response object !'
            );
            
        });
        
    });
    
    describe('When calling the constructor with good parameters', function() {
        
        it('should not throw an error', function() {
            
            new OAuth.AuthStatus(
                {
                    status : 'connected', 
                    accessTokenResponse : new OAuth.AccessToken.SuccessfulResponse()
                }
            );
            
        });
        
    });
    
    describe('When calling the \'getAccessTokenResponse()\'', function() {
        
        it('should return the Access Token Response configured in the constructor', function() {
            
            var accessTokenResponse = new OAuth.AccessToken.SuccessfulResponse(),
                authStatus = new OAuth.AuthStatus(
                    {
                        status : 'connected', 
                        accessTokenResponse : accessTokenResponse
                    }
                );
            
            expect(authStatus.getAccessTokenResponse()).to.equal(accessTokenResponse);
            
        });
        
    });
    
    describe('When calling the \'isConnected()\' with a \'connected\' status', function() {
        
        it('should return true', function() {
            
            var authStatus = new OAuth.AuthStatus(
                {
                    status : 'connected', 
                    accessTokenResponse : new OAuth.AccessToken.SuccessfulResponse()
                }
            );
            
            expect(authStatus.isConnected()).to.be.true;
            
        });
        
    });
    
    describe('When calling the \'isConnected()\' with a \'disconnected\' status', function() {
        
        it('should return false', function() {
            
            var authStatus = new OAuth.AuthStatus(
                {
                    status : 'disconnected', 
                    accessTokenResponse : new OAuth.AccessToken.SuccessfulResponse()
                }
            );
            
            expect(authStatus.isConnected()).to.be.false;
            
        });
        
    });
    
    describe('When calling the \'isDisconnected()\' with a \'connected\' status', function() {
        
        it('should return false', function() {
            
            var authStatus = new OAuth.AuthStatus(
                {
                    status : 'connected', 
                    accessTokenResponse : new OAuth.AccessToken.SuccessfulResponse()
                }
            );
            
            expect(authStatus.isDisconnected()).to.be.false;
            
        });
        
    });
    
    describe('When calling the \'isDisconnected()\' with a \'disconnected\' status', function() {
        
        it('should return true', function() {
            
            var authStatus = new OAuth.AuthStatus(
                {
                    status : 'disconnected', 
                    accessTokenResponse : new OAuth.AccessToken.SuccessfulResponse()
                }
            );
            
            expect(authStatus.isDisconnected()).to.be.true;
            
        });
        
    });
    

});