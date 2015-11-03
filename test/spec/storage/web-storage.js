/*jshint -W030 */

describe('OAuth.Storage.WebStorage', function() {
    
    beforeEach(function() {
        localStorage.clear();
    });
    
    describe('upon initialization', function() {
        
        it('should support Web Storage', function() {
            
            var backupedStorage = Storage;
            Storage = undefined;
            
            expect(function() {
                return new OAuth.Storage.WebStorage({});
            }).to.throw(
                Error, 
                'Your browser does not support HTML5 Web Storage !'
            );
            
            Storage = backupedStorage;
            
        });

    });

    describe('When persisting an access token response with an invalid XMLHttpRequest', function() {
        
        it('should throw an error', function() {

            expect(localStorage.getItem('oauth.js.authStatus')).to.be.null;
            
            var storageManager = new OAuth.Storage.WebStorage();
            
            // Test without any parameter
            expect(function() {
                storageManager.persistAccessTokenResponse();
            }).to.throw(
                Error, 
                'The provided XHMLHttpRequest object is invalid !'
            );
            
            expect(localStorage.getItem('oauth.js.authStatus')).to.be.null;
            
            // Test with a parameter which is not an object
            expect(function() {
                storageManager.persistAccessTokenResponse('bad_type');
            }).to.throw(
                Error, 
                'The provided XHMLHttpRequest object is invalid !'
            );
            
            expect(localStorage.getItem('oauth.js.authStatus')).to.be.null;
            
            // Test with an XMLHttpRequest object which is not in the DONE state
            expect(function() {
                storageManager.persistAccessTokenResponse(new XMLHttpRequest());
            }).to.throw(
                Error, 
                'The provided XHMLHttpRequest object must be in the DONE state before used for persistance !'
            );
            
            expect(localStorage.getItem('oauth.js.authStatus')).to.be.null;
            
        });
        
    });
    
    describe('When persisting an access token response with a valid XMLHttpRequest', function() {
        
        it('should persist and return a valid AuthStatus', function() {
            
            expect(localStorage.getItem('oauth.js.authStatus')).to.be.null;
            
            // Create a fake XMLHttpRequest object
            // @see https://github.com/driverdan/node-XMLHttpRequest/blob/master/lib/XMLHttpRequest.js
            var xhr = new XMLHttpRequest();
            xhr.readyState = XMLHttpRequest.DONE;
            xhr.status = 200;
            xhr.statusText = 'OK';
            xhr.response = '{' +
                '"access_token":"access_token",' + 
                '"refresh_token":"refresh_token",' + 
                '"token_type":"Bearer",' +
                '"expires_in":3600' +
            '}';
            xhr.responseText = '{' +
                '"access_token":"access_token",' + 
                '"refresh_token":"refresh_token",' + 
                '"token_type":"Bearer",' +
                '"expires_in":3600' +
            '}';
            xhr.responseXML = null;
            
            var accessTokenResponse = new OAuth.AccessToken.SuccessfulResponse(), 
                expectedAuthStatus = null,
                storageManager = new OAuth.Storage.WebStorage(),
                authStatus = storageManager.persistAccessTokenResponse(xhr);

            accessTokenResponse.setJsonResponse({
                access_token : 'access_token',
                refresh_token : 'refresh_token',
                token_type : 'Bearer',
                expires_in : 3600
            });
            accessTokenResponse.setXhr(xhr);
            expectedAuthStatus =  new OAuth.AuthStatus(
                {
                    status : 'connected',
                    accessTokenResponse : accessTokenResponse
                }
            );
            
            // Check everything is ok on the local storage
            expect(localStorage.getItem('oauth.js.authStatus')).to.not.be.null;
            expect(localStorage.getItem('oauth.js.authStatus')).to.equal(expectedAuthStatus.toString());
            
            // Check everything is ok with the returned AuthStatus
            expect(authStatus.isConnected()).to.be.true;
            expect(authStatus.getAccessTokenResponse().isSuccessful()).to.be.true;
            
            expect(Object.keys(authStatus.getAccessTokenResponse().getJsonResponse()).length).to.equal(4);
            expect(authStatus.getAccessTokenResponse().getJsonResponse().access_token).to.equal('access_token');
            expect(authStatus.getAccessTokenResponse().getJsonResponse().refresh_token).to.equal('refresh_token');
            expect(authStatus.getAccessTokenResponse().getJsonResponse().token_type).to.equal('Bearer');
            expect(authStatus.getAccessTokenResponse().getJsonResponse().expires_in).to.equal(3600);
            
            expect(authStatus.getAccessTokenResponse().getXhr().readyState).to.equal(xhr.readyState);
            expect(authStatus.getAccessTokenResponse().getXhr().status).to.equal(xhr.status);
            expect(authStatus.getAccessTokenResponse().getXhr().statusText).to.equal(xhr.statusText);
            expect(authStatus.getAccessTokenResponse().getXhr().response).to.equal(xhr.response);
            expect(authStatus.getAccessTokenResponse().getXhr().responseText).to.equal(xhr.responseText);
            expect(authStatus.getAccessTokenResponse().getXhr().responseXML).to.equal(xhr.responseXML);

        });
        
    });
    
    describe('when persisting a raw access token response', function() {
        
        it('should persist on Web Storage with default storage key', function() {

            expect(localStorage.getItem('oauth.js.accessTokenResponse')).to.be.null;

            var storageManager = new OAuth.Storage.WebStorage();
            storageManager.persistRawAccessTokenResponse(
                '{' + 
                    '"access_token" : "ACCESS_TOKEN",' +
                    '"token_type" : "bearer",' + 
                    '"expires_in" : "3600",' + 
                    '"scope" : "scope1,scope2,scope3",' + 
                    '"state" : "state"' + 
                '}'
            );

            expect(localStorage.getItem('oauth.js.accessTokenResponse')).to.not.be.null;
            
            var accessTokenResponse = storageManager.getAccessTokenResponse();
            expect(accessTokenResponse).to.not.be.null;
            expect(accessTokenResponse.access_token).to.equal('ACCESS_TOKEN');
            expect(accessTokenResponse.token_type).to.equal('bearer');
            expect(accessTokenResponse.expires_in).to.equal('3600');
            expect(accessTokenResponse.scope).to.equal('scope1,scope2,scope3');
            expect(accessTokenResponse.state).to.equal('state');

        });
        
    });
    
});