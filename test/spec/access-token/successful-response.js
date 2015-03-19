/*jshint -W030 */

describe('OAuth.AccessToken.SuccessfulResponse', function() {

    describe('When calling \'isError()\'', function() {
        
        it('should return false', function() {
            
            var accessTokenResponse = new OAuth.AccessToken.SuccessfulResponse();
            expect(accessTokenResponse.isError()).to.be.false;

        });
        
    });
    
    describe('When calling \'isSuccessful()\'', function() {
        
        it('should return true', function() {
            
            var accessTokenResponse = new OAuth.AccessToken.SuccessfulResponse();
            expect(accessTokenResponse.isSuccessful()).to.be.true;

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
            
            var accessTokenResponse = new OAuth.AccessToken.SuccessfulResponse();
            accessTokenResponse.setJsonResponse(
                {
                    access_token : 'access_token',
                    refresh_token : 'refresh_token',
                    expires_in : 3600
                }
            );
            accessTokenResponse.setXhr(xhr);
            
            var jsonObject = accessTokenResponse.toJSON();
            expect(Object.keys(jsonObject).length).to.equal(2);
            expect(jsonObject.hasOwnProperty('jsonResponse')).to.be.true;
            expect(jsonObject.hasOwnProperty('xhr')).to.be.true;
            expect(Object.keys(jsonObject.jsonResponse).length).to.equal(3);
            expect(jsonObject.jsonResponse.access_token).to.equal('access_token');
            expect(jsonObject.jsonResponse.refresh_token).to.equal('refresh_token');
            expect(jsonObject.jsonResponse.expires_in).to.equal(3600);
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