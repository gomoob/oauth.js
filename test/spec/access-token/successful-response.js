describe('OAuth.AccessToken.SuccessfulResponse', function() {

    describe('When calling \'isError()\'', function() {
        
        it('should return false', function() {
            
            var accessTokenResponse = new OAuth.AccessToken.SuccessfulResponse();
            expect(accessTokenResponse.isError()).to.be.false();

        });
        
    });
    
    describe('When calling \'isSuccessful()\'', function() {
        
        it('should return true', function() {
            
            var accessTokenResponse = new OAuth.AccessToken.SuccessfulResponse();
            expect(accessTokenResponse.isSuccessful()).to.be.true();

        });
        
    });
    
});