describe('ErrorParser : ', function() {
    
    describe('when calling parse', function() {
        
        it('should return undefined if the error is not an expected one', function() {
            
            var errorParser = new ErrorParser();
            
            expect(errorParser.parse({
                status: 200
            })).to.be.undefined();
            
        });
        
        it('should return refresh if the token is expired', function() {
            
            var errorParser = new ErrorParser();
            
            expect(errorParser.parse({
                status: 401, 
                responseText : 'token_expired'
            })).to.equal('refresh');
            
        });
        
        it('should return reniew if the token is invalid', function() {
            
            var errorParser = new ErrorParser();
            
            expect(errorParser.parse({
                status: 401, 
                responseText : 'token_invalid'
            })).to.equal('reniew');
            
        });
        
    });

});