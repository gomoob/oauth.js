describe('AccessTokenResponseStorage : ', function() {
    
    beforeEach(function() {
        localStorage.clear();
    });
    
    describe('upon initialization', function() {
        
        it('should support Web Storage', function() {
            
            var backupedStorage = Storage;
            Storage = undefined;
            
            expect(function() {
                return new StorageManager({});
            }).to.throw(
                Error, 
                'Your browser does not support HTML5 Web Storage !'
            );
            
            Storage = backupedStorage;
            
        });

    });
    
    describe('when persisting a raw access token response', function() {
        
        it('should persist on Web Storage with default storage key', function() {

            expect(localStorage.getItem('oauth.js.accessTokenResponse')).to.be.null();

            var storageManager = new StorageManager();
            storageManager.persistRawAccessTokenResponse(
                '{' + 
                    '"access_token" : "ACCESS_TOKEN",' +
                    '"token_type" : "bearer",' + 
                    '"expires_in" : "3600",' + 
                    '"scope" : "scope1,scope2,scope3",' + 
                    '"state" : "state"' + 
                '}'
            );

            expect(localStorage.getItem('oauth.js.accessTokenResponse')).to.not.be.null();
            
            var accessTokenResponse = storageManager.getAccessTokenResponse();
            expect(accessTokenResponse).to.not.be.null();
            expect(accessTokenResponse.access_token).to.equal('ACCESS_TOKEN');
            expect(accessTokenResponse.token_type).to.equal('bearer');
            expect(accessTokenResponse.expires_in).to.equal('3600');
            expect(accessTokenResponse.scope).to.equal('scope1,scope2,scope3');
            expect(accessTokenResponse.state).to.equal('state');

        });
        
    });
    
});