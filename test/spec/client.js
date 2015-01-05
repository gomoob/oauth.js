describe('Oauth2Client : ', function() {
    
    describe('upon initialization', function() {
        
        it('should provide a configuration object', function() {
            expect(OAuth2Client).to.throw(
                Error, 
                'A configuration object is required !'
            );
        });
        
        it('should provide a token endpoint', function() {
            expect(function() {
                return new OAuth2Client({});
            }).to.throw(
                Error, 
                'A token endpoint is required !'
            );
        });

    });
    
});