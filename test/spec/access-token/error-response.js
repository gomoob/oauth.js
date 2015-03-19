/*jshint -W030 */

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
            expect(accessTokenResponse.isCriticalError()).to.be.false;

            accessTokenResponse.setError('invalid_client');
            expect(accessTokenResponse.isCriticalError()).to.be.false;

            accessTokenResponse.setError('invalid_grant');
            expect(accessTokenResponse.isCriticalError()).to.be.false;

            accessTokenResponse.setError('unauthorized_client');
            expect(accessTokenResponse.isCriticalError()).to.be.false;

            accessTokenResponse.setError('unsupported_grant_type');
            expect(accessTokenResponse.isCriticalError()).to.be.false;

            accessTokenResponse.setError('invalid_scope');
            expect(accessTokenResponse.isCriticalError()).to.be.false;

        });
        
    });
    
    describe('When calling \'isCriticalError()\' with an extension OAuth 2.0 error code', function() {
        
        it('should return false', function() {
            
            var accessTokenResponse = new OAuth.AccessToken.ErrorResponse();
            accessTokenResponse.setError('extension_error_code');
            expect(accessTokenResponse.isCriticalError()).to.be.false;

        });
        
    });
    
    describe('When calling \'isCriticalError()\' with a critical error code', function() {
        
        it('should return false', function() {
            
            var accessTokenResponse = new OAuth.AccessToken.ErrorResponse();
            accessTokenResponse.setError('__oauth_js__uninitialized__');
            expect(accessTokenResponse.isCriticalError()).to.be.true;

        });
        
    });
    
    describe('When calling \'isError()\'', function() {
        
        it('should return true', function() {
            
            var accessTokenResponse = new OAuth.AccessToken.ErrorResponse();
            expect(accessTokenResponse.isError()).to.be.true;

        });
        
    });
    
    describe('When calling \'isExtensionError()\' with a standard OAuth 2.0 error code', function() {
        
        it('should return false', function() {
            
            var accessTokenResponse = new OAuth.AccessToken.ErrorResponse();

            accessTokenResponse.setError('invalid_request');
            expect(accessTokenResponse.isExtensionError()).to.be.false;

            accessTokenResponse.setError('invalid_client');
            expect(accessTokenResponse.isExtensionError()).to.be.false;

            accessTokenResponse.setError('invalid_grant');
            expect(accessTokenResponse.isExtensionError()).to.be.false;

            accessTokenResponse.setError('unauthorized_client');
            expect(accessTokenResponse.isExtensionError()).to.be.false;

            accessTokenResponse.setError('unsupported_grant_type');
            expect(accessTokenResponse.isExtensionError()).to.be.false;

            accessTokenResponse.setError('invalid_scope');
            expect(accessTokenResponse.isExtensionError()).to.be.false;

        });
        
    });
    
    describe('When calling \'isExtensionError()\' with an extension OAuth 2.0 error code', function() {
        
        it('should return true', function() {
            
            var accessTokenResponse = new OAuth.AccessToken.ErrorResponse();
            accessTokenResponse.setError('extension_error_code');
            expect(accessTokenResponse.isExtensionError()).to.be.true;

        });
        
    });
    
    describe('When calling \'isExtensionError()\' with a critical error code', function() {
        
        it('should return false', function() {
            
            var accessTokenResponse = new OAuth.AccessToken.ErrorResponse();
            accessTokenResponse.setError('__oauth_js__uninitialized__');
            expect(accessTokenResponse.isExtensionError()).to.be.false;

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
            ).to.be.true;

            expect(
                OAuth.AccessToken.ErrorResponse.isJsonResponseValid(
                    {
                        'error' : 'extension_error_code'
                    }
                )
            ).to.be.true;

        });
        
    });

    describe('When calling \'isJsonResponseValid()\' with an invalid error response', function() {
        
        it('should return true', function() {
            
            // The response MUST BE a JSON object
            expect(OAuth.AccessToken.ErrorResponse.isJsonResponseValid('no_an_object')).to.be.false;
            
            // The response MUST HAVE an 'error' property
            expect(OAuth.AccessToken.ErrorResponse.isJsonResponseValid({})).to.be.false;
            expect(OAuth.AccessToken.ErrorResponse.isJsonResponseValid({'a': 'a_value'})).to.be.false;
            
            // The 'error' property MUST BE a string
            expect(OAuth.AccessToken.ErrorResponse.isJsonResponseValid({'error': 9876})).to.be.false;
            
            // The 'error' property MUST NOT contain characters outside the range '%x20-21 / %x23-5B / %x5D-7E'
            // @see http://www.unicode.org/charts/PDF/U0000.pdf
            expect(
                OAuth.AccessToken.ErrorResponse.isJsonResponseValid(
                    {
                        'error': 'bad_error_code"'
                    }
                )
            ).to.be.false;

        });
        
    });
    
    describe('When calling \'isStandardError()\' with a standard OAuth 2.0 error code', function() {
        
        it('should return true', function() {
            
            var accessTokenResponse = new OAuth.AccessToken.ErrorResponse();

            accessTokenResponse.setError('invalid_request');
            expect(accessTokenResponse.isStandardError()).to.be.true;

            accessTokenResponse.setError('invalid_client');
            expect(accessTokenResponse.isStandardError()).to.be.true;

            accessTokenResponse.setError('invalid_grant');
            expect(accessTokenResponse.isStandardError()).to.be.true;

            accessTokenResponse.setError('unauthorized_client');
            expect(accessTokenResponse.isStandardError()).to.be.true;

            accessTokenResponse.setError('unsupported_grant_type');
            expect(accessTokenResponse.isStandardError()).to.be.true;

            accessTokenResponse.setError('invalid_scope');
            expect(accessTokenResponse.isStandardError()).to.be.true;

        });
        
    });
    
    describe('When calling \'isStandardError()\' with an extension OAuth 2.0 error code', function() {
        
        it('should return false', function() {
            
            var accessTokenResponse = new OAuth.AccessToken.ErrorResponse();
            accessTokenResponse.setError('extension_error_code');
            expect(accessTokenResponse.isStandardError()).to.be.false;

        });
        
    });

    describe('When calling \'isStandardError()\' with a critical error code', function() {
        
        it('should return false', function() {
            
            var accessTokenResponse = new OAuth.AccessToken.ErrorResponse();
            accessTokenResponse.setError('__oauth_js__uninitialized__');
            expect(accessTokenResponse.isStandardError()).to.be.false;

        });
        
    });

    describe('When calling \'isSuccessful()\'', function() {
        
        it('should return false', function() {
            
            var accessTokenResponse = new OAuth.AccessToken.ErrorResponse();
            expect(accessTokenResponse.isSuccessful()).to.be.false;

        });
        
    });
    
    describe('When calling \'toJSON()\'', function() {
        
        it('should return a valid json object', function() {
            
            // Create a fake XMLHttpRequest object
            // @see https://github.com/driverdan/node-XMLHttpRequest/blob/master/lib/XMLHttpRequest.js
            var xhr = new XMLHttpRequest();
            xhr.readyState = xhr.DONE;
            xhr.status = 200;
            xhr.statusText = 'OK';
            xhr.response = 'RESPONSE';
            xhr.responseText = 'RESPONSE_TEXT';
            xhr.responseXML = 'RESPONSE_XML';
            
            var accessTokenResponse = new OAuth.AccessToken.ErrorResponse();
            accessTokenResponse.setError('invalid_grant');
            accessTokenResponse.setJsonResponse(
                {
                    access_token : 'access_token',
                    refresh_token : 'refresh_token',
                    token_type : 'Bearer',
                    expires_in : 3600
                }
            );
            accessTokenResponse.setXhr(xhr);
            
            var jsonObject = accessTokenResponse.toJSON();
            
            // Checks root properties
            expect(Object.keys(jsonObject).length).to.equal(3);
            expect(jsonObject.hasOwnProperty('error')).to.be.true;
            expect(jsonObject.hasOwnProperty('jsonResponse')).to.be.true;
            expect(jsonObject.hasOwnProperty('xhr')).to.be.true;
            expect(jsonObject.error).to.equal('invalid_grant');
            
            // Checks jsonResponse properties
            expect(Object.keys(jsonObject.jsonResponse).length).to.equal(4);
            expect(jsonObject.jsonResponse.access_token).to.equal('access_token');
            expect(jsonObject.jsonResponse.refresh_token).to.equal('refresh_token');
            expect(jsonObject.jsonResponse.token_type).to.equal('Bearer');
            expect(jsonObject.jsonResponse.expires_in).to.equal(3600);
            
            // Checks XHR properties
            expect(Object.keys(jsonObject.xhr).length).to.equal(6);
            expect(jsonObject.xhr.hasOwnProperty('readyState')).to.be.true;
            expect(jsonObject.xhr.hasOwnProperty('status')).to.be.true;
            expect(jsonObject.xhr.hasOwnProperty('statusText')).to.be.true;
            expect(jsonObject.xhr.hasOwnProperty('response')).to.be.true;
            expect(jsonObject.xhr.hasOwnProperty('responseText')).to.be.true;
            expect(jsonObject.xhr.hasOwnProperty('responseXML')).to.be.true;
            expect(jsonObject.xhr.readyState).to.equal(xhr.DONE);
            expect(jsonObject.xhr.status).to.equal(200);
            expect(jsonObject.xhr.statusText).to.equal('OK');
            expect(jsonObject.xhr.response).to.equal('RESPONSE');
            expect(jsonObject.xhr.responseText).to.equal('RESPONSE_TEXT');
            expect(jsonObject.xhr.responseXML).to.equal('RESPONSE_XML');

        });
        
    });
    
});