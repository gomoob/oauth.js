describe('OAuth.AccessToken.ResponseParser', function() {

    describe('When calling \'isError()\'', function() {
        
        it('should return true', function() {
            
            var accessTokenResponse = new OAuth.AccessToken.ErrorResponse();
            expect(accessTokenResponse.isError()).to.be.true();

        });
        
    });
    
});