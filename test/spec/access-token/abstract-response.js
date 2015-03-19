/*jshint -W030 */

describe('OAuth.AccessToken.AbstractResponse', function() {

    describe('When calling \'isJsonValid()\' with a valid JSON object', function() {
        
        it('should return true', function() {
            
            // Test with a valid Error Access Token Response
            expect(
                OAuth.AccessToken.AbstractResponse.isJsonValid(
                    {
                        jsonResponse : {
                            error : 'invalid_grant'
                        },
                        xhr : {
                            readyState : 4,
                            status : 400,
                            statusText : 'Bad Request',
                            response : 'THE_RESPONSE',
                            responseText : 'THE_RESPONSE',
                            responseXML : 'THE_RESPONSE_XML'
                        }
                    }
                )
            ).to.be.true;
            
            // Test with a valid Successful Access Token Response
            expect(
                OAuth.AccessToken.AbstractResponse.isJsonValid(
                    {
                        jsonResponse : {
                            access_token : 'access_token',
                            refresh_token : 'refresh_token',
                            token_type : 'Bearer',
                            expires_in : 3600
                        },
                        xhr : {
                            readyState : 4,
                            status : 200,
                            statusText : 'OK',
                            response : 'THE_RESPONSE',
                            responseText : 'THE_RESPONSE',
                            responseXML : 'THE_RESPONSE_XML'
                        }
                    }
                )
            ).to.be.true;

        });
        
    });
    
    describe('When calling \'isJsonValid()\' with an invalid JSON object', function() {
        
        it('should return false', function() {
        
            // Test with a parameter which is not an object
            expect(OAuth.AccessToken.AbstractResponse.isJsonValid('bad_type')).to.be.false;
            
            // Test with an object having a bad 'jsonResponse' object
            expect(
                OAuth.AccessToken.AbstractResponse.isJsonValid(
                    {
                        jsonResponse : 98769,
                        xhr : {
                            readyState : 4,
                            status : 200,
                            statusText : 'OK',
                            response : 'THE_RESPONSE',
                            responseText : 'THE_RESPONSE',
                            responseXML : 'THE_RESPONSE_XML'
                        }
                    }
                )
            ).to.be.false;
            
            // Test with an object having a bad Error 'jsonResponse' object
            expect(
                OAuth.AccessToken.AbstractResponse.isJsonValid(
                    {
                        jsonResponse : {
                            error : 98769876
                        },
                        xhr : {
                            readyState : 4,
                            status : 200,
                            statusText : 'OK',
                            response : 'THE_RESPONSE',
                            responseText : 'THE_RESPONSE',
                            responseXML : 'THE_RESPONSE_XML'
                        }
                    }
                )
            ).to.be.false;
            
            // Test with an object having a bad Successful 'jsonResponse' object
            expect(
                OAuth.AccessToken.AbstractResponse.isJsonValid(
                    {
                        jsonResponse : {
                            access_token : 'access_token',
                            refresh_token : 'refresh_token',
                            expires_in : 3600
                        },
                        xhr : {
                            readyState : 4,
                            status : 200,
                            statusText : 'OK',
                            response : 'THE_RESPONSE',
                            responseText : 'THE_RESPONSE',
                            responseXML : 'THE_RESPONSE_XML'
                        }
                    }
                )
            ).to.be.false;

            // Test with an object having a bad 'xhr' object
            expect(
                OAuth.AccessToken.AbstractResponse.isJsonValid(
                    {
                        jsonResponse : {
                            access_token : 'access_token',
                            refresh_token : 'refresh_token',
                            token_type : 'Bearer',
                            expires_in : 3600
                        },
                        xhr : 9876
                    }
                )
            ).to.be.false;

        });
        
    });
    
    describe('When calling \'isJsonXhrValid()\' with a valid JSON object', function() {
        
        it('should return true', function() {
            
            expect(
                OAuth.AccessToken.AbstractResponse.isJsonXhrValid(
                    {
                        readyState : 4,
                        status : 200,
                        statusText : 'OK',
                        response : 'THE_RESPONSE',
                        responseText : 'THE_RESPONSE',
                        responseXML : 'THE_RESPONSE_XML'
                    }
                )
            ).to.be.true;

        });
        
    });
    
    describe('When calling \'isJsonXhrValid()\' with an invalid JSON object', function() {
        
        it('should return false', function() {
            
            // Test with a parameter which is not an object
            expect(OAuth.AccessToken.AbstractResponse.isJsonXhrValid('bad_type')).to.be.false;

            // Test with a missing 'readyState' parameter
            expect(
                OAuth.AccessToken.AbstractResponse.isJsonXhrValid(
                    {
                        status : 200,
                        statusText : 'OK',
                        response : 'THE_RESPONSE',
                        responseText : 'THE_RESPONSE',
                        responseXML : 'THE_RESPONSE_XML'
                    }
                )
            ).to.be.false;
            
            // Test with a bad 'readyState' parameter
            expect(
                OAuth.AccessToken.AbstractResponse.isJsonXhrValid(
                    {
                        readyState : 'bad_type',
                        status : 200,
                        statusText : 'OK',
                        response : 'THE_RESPONSE',
                        responseText : 'THE_RESPONSE',
                        responseXML : 'THE_RESPONSE_XML'
                    }
                )
            ).to.be.false;
            
            // Test with a missing 'status' parameter
            expect(
                OAuth.AccessToken.AbstractResponse.isJsonXhrValid(
                    {
                        readyState : 4,
                        statusText : 'OK',
                        response : 'THE_RESPONSE',
                        responseText : 'THE_RESPONSE',
                        responseXML : 'THE_RESPONSE_XML'
                    }
                )
            ).to.be.false;
            
            // Test with a bad 'status' parameter
            expect(
                OAuth.AccessToken.AbstractResponse.isJsonXhrValid(
                    {
                        readyState : 4,
                        status : 'bad_type',
                        statusText : 'OK',
                        response : 'THE_RESPONSE',
                        responseText : 'THE_RESPONSE',
                        responseXML : 'THE_RESPONSE_XML'
                    }
                )
            ).to.be.false;
            
            // Test with a missing 'statusText' parameter
            expect(
                OAuth.AccessToken.AbstractResponse.isJsonXhrValid(
                    {
                        readyState : 4,
                        status : 200,
                        response : 'THE_RESPONSE',
                        responseText : 'THE_RESPONSE',
                        responseXML : 'THE_RESPONSE_XML'
                    }
                )
            ).to.be.false;
            
            // Test with a bad 'statusText' parameter
            expect(
                OAuth.AccessToken.AbstractResponse.isJsonXhrValid(
                    {
                        readyState : 4,
                        status : 200,
                        statusText : 98769876,
                        response : 'THE_RESPONSE',
                        responseText : 'THE_RESPONSE',
                        responseXML : 'THE_RESPONSE_XML'
                    }
                )
            ).to.be.false;
            
            // FIXME: Tests with bad 'response' parameters are not already implemented

            // Test with a missing 'responseText' parameter
            expect(
                OAuth.AccessToken.AbstractResponse.isJsonXhrValid(
                    {
                        readyState : 4,
                        status : 200,
                        statusText : 'OK',
                        response : 'THE_RESPONSE',
                        responseXML : 'THE_RESPONSE_XML'
                    }
                )
            ).to.be.false;
            
            // Test with a bad 'responseText' parameter
            expect(
                OAuth.AccessToken.AbstractResponse.isJsonXhrValid(
                    {
                        readyState : 4,
                        status : 200,
                        statusText : 'OK',
                        response : 'THE_RESPONSE',
                        responseText : 98769,
                        responseXML : 'THE_RESPONSE_XML'
                    }
                )
            ).to.be.false;

            // Test with a missing 'responseXML' parameter
            expect(
                OAuth.AccessToken.AbstractResponse.isJsonXhrValid(
                    {
                        readyState : 4,
                        status : 200,
                        statusText : 'OK',
                        response : 'THE_RESPONSE',
                        responseText : 'THE_RESPONSE',
                    }
                )
            ).to.be.false;
            
            // Test with a bad 'responseXML' parameter
            expect(
                OAuth.AccessToken.AbstractResponse.isJsonXhrValid(
                    {
                        readyState : 4,
                        status : 200,
                        statusText : 'OK',
                        response : 'THE_RESPONSE',
                        responseText : 'THE_RESPONSE',
                        responseXML : 98769
                    }
                )
            ).to.be.false;
            
        });
        
    });
    
});
