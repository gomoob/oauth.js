describe('OAuth.AccessToken.ErrorResponse', function() {

    describe('When calling \'getError()\'', function() {
        
        it('should return a valid value', function() {
            
            var accessTokenResponse = new OAuth.AccessToken.ErrorResponse();
            expect(accessTokenResponse.getError()).to.equal('__oauth_js__uninitialized__');
            
            accessTokenResponse.setError('an_error');
            expect(accessTokenResponse.getError()).to.equal('an_error');
            
        });
        
    });
    
    describe('When calling \'isCriticalError()\' with a standard OAuth 2.0 error code', function() {
        
        it('should return false', function() {
            
            var accessTokenResponse = new OAuth.AccessToken.ErrorResponse();

            accessTokenResponse.setError('invalid_request');
            expect(accessTokenResponse.isCriticalError()).to.be.false();

            accessTokenResponse.setError('invalid_client');
            expect(accessTokenResponse.isCriticalError()).to.be.false();

            accessTokenResponse.setError('invalid_grant');
            expect(accessTokenResponse.isCriticalError()).to.be.false();

            accessTokenResponse.setError('unauthorized_client');
            expect(accessTokenResponse.isCriticalError()).to.be.false();

            accessTokenResponse.setError('unsupported_grant_type');
            expect(accessTokenResponse.isCriticalError()).to.be.false();

            accessTokenResponse.setError('invalid_scope');
            expect(accessTokenResponse.isCriticalError()).to.be.false();

        });
        
    });
    
    describe('When calling \'isCriticalError()\' with an extension OAuth 2.0 error code', function() {
        
        it('should return false', function() {
            
            var accessTokenResponse = new OAuth.AccessToken.ErrorResponse();
            accessTokenResponse.setError('extension_error_code');
            expect(accessTokenResponse.isCriticalError()).to.be.false();

        });
        
    });
    
    describe('When calling \'isCriticalError()\' with a critical error code', function() {
        
        it('should return false', function() {
            
            var accessTokenResponse = new OAuth.AccessToken.ErrorResponse();
            accessTokenResponse.setError('__oauth_js__uninitialized__');
            expect(accessTokenResponse.isCriticalError()).to.be.true();

        });
        
    });
    
    describe('When calling \'isError()\'', function() {
        
        it('should return true', function() {
            
            var accessTokenResponse = new OAuth.AccessToken.ErrorResponse();
            expect(accessTokenResponse.isError()).to.be.true();

        });
        
    });
    
    describe('When calling \'isExtensionError()\' with a standard OAuth 2.0 error code', function() {
        
        it('should return false', function() {
            
            var accessTokenResponse = new OAuth.AccessToken.ErrorResponse();

            accessTokenResponse.setError('invalid_request');
            expect(accessTokenResponse.isExtensionError()).to.be.false();

            accessTokenResponse.setError('invalid_client');
            expect(accessTokenResponse.isExtensionError()).to.be.false();

            accessTokenResponse.setError('invalid_grant');
            expect(accessTokenResponse.isExtensionError()).to.be.false();

            accessTokenResponse.setError('unauthorized_client');
            expect(accessTokenResponse.isExtensionError()).to.be.false();

            accessTokenResponse.setError('unsupported_grant_type');
            expect(accessTokenResponse.isExtensionError()).to.be.false();

            accessTokenResponse.setError('invalid_scope');
            expect(accessTokenResponse.isExtensionError()).to.be.false();

        });
        
    });
    
    describe('When calling \'isExtensionError()\' with an extension OAuth 2.0 error code', function() {
        
        it('should return true', function() {
            
            var accessTokenResponse = new OAuth.AccessToken.ErrorResponse();
            accessTokenResponse.setError('extension_error_code');
            expect(accessTokenResponse.isExtensionError()).to.be.true();

        });
        
    });
    
    describe('When calling \'isExtensionError()\' with a critical error code', function() {
        
        it('should return false', function() {
            
            var accessTokenResponse = new OAuth.AccessToken.ErrorResponse();
            accessTokenResponse.setError('__oauth_js__uninitialized__');
            expect(accessTokenResponse.isExtensionError()).to.be.false();

        });
        
    });
    
    describe('When calling \'isJsonResponseValid()\' with a valid error response', function() {
        
        it('should return true', function() {
            
            expect(
                OAuth.AccessToken.ErrorResponse.isJsonResponseValid(
                    {
                        error : 'invalid_grant'
                    }
                )
            ).to.be.true();

            /*
            expect(
                OAuth.AccessToken.ErrorResponse.isJsonResponseValid(
                    {
                        'error' : 'extension_error_code'
                    }
                )
            ).to.be.true();
            */
        });
        
    });
    /*
    describe('When calling \'isJsonResponseValid()\' with an invalid error response', function() {
        
        it('should return true', function() {
            
            // The response MUST BE a JSON object
            expect(OAuth.AccessToken.ErrorResponse.isJsonResponseValid('no_an_object')).to.be.false();
            
            // The response MUST HAVE an 'error' property
            expect(OAuth.AccessToken.ErrorResponse.isJsonResponseValid({})).to.be.false();
            expect(OAuth.AccessToken.ErrorResponse.isJsonResponseValid({'a': 'a_value'})).to.be.false();
            
            // The 'error' property MUST BE a string
            expect(OAuth.AccessToken.ErrorResponse.isJsonResponseValid({'error': 9876})).to.be.false();
            
            // The 'error' property MUST NOT contain characters outside the range '%x20-21 / %x23-5B / %x5D-7E'
            // @see http://www.unicode.org/charts/PDF/U0000.pdf
            expect(
                OAuth.AccessToken.ErrorResponse.isJsonResponseValid(
                    {
                        'error': 'bad_error_code"'
                    }
                )
            ).to.be.false();

        });
        
    });*/
    
    describe('When calling \'isStandardError()\' with a standard OAuth 2.0 error code', function() {
        
        it('should return true', function() {
            
            var accessTokenResponse = new OAuth.AccessToken.ErrorResponse();

            accessTokenResponse.setError('invalid_request');
            expect(accessTokenResponse.isStandardError()).to.be.true();

            accessTokenResponse.setError('invalid_client');
            expect(accessTokenResponse.isStandardError()).to.be.true();

            accessTokenResponse.setError('invalid_grant');
            expect(accessTokenResponse.isStandardError()).to.be.true();

            accessTokenResponse.setError('unauthorized_client');
            expect(accessTokenResponse.isStandardError()).to.be.true();

            accessTokenResponse.setError('unsupported_grant_type');
            expect(accessTokenResponse.isStandardError()).to.be.true();

            accessTokenResponse.setError('invalid_scope');
            expect(accessTokenResponse.isStandardError()).to.be.true();

        });
        
    });
    
    describe('When calling \'isStandardError()\' with an extension OAuth 2.0 error code', function() {
        
        it('should return false', function() {
            
            var accessTokenResponse = new OAuth.AccessToken.ErrorResponse();
            accessTokenResponse.setError('extension_error_code');
            expect(accessTokenResponse.isStandardError()).to.be.false();

        });
        
    });

    describe('When calling \'isStandardError()\' with a critical error code', function() {
        
        it('should return false', function() {
            
            var accessTokenResponse = new OAuth.AccessToken.ErrorResponse();
            accessTokenResponse.setError('__oauth_js__uninitialized__');
            expect(accessTokenResponse.isStandardError()).to.be.false();

        });
        
    });

    describe('When calling \'isSuccessful()\'', function() {
        
        it('should return false', function() {
            
            var accessTokenResponse = new OAuth.AccessToken.ErrorResponse();
            expect(accessTokenResponse.isSuccessful()).to.be.false();

        });
        
    });
    
});