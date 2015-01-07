describe('OAuth : ', function() {
    
    it('create request manager with invalid framework', function() {
        
        expect(function() {
            OAuth.createRequestManager(
                'unknown', 
                {
                    credentialsGetter : {},
                    tokenEndpoint : 'https://test.com/token'
                }
            );
        }).to.throw(
            Error, 
            'Unknown or unsupported framework \'unknown\' !'
        );
        
    });
    
    it('create angular request manager', function() {
        
        var requestManager = OAuth.createRequestManager(
            'angular', 
            {
                credentialsGetter : {},
                tokenEndpoint : 'https://test.com/token'
            }
        );
        
        expect(requestManager).to.not.be.null();
        
    });
    
    it('create backbone request manager', function() {
        
        var requestManager = OAuth.createRequestManager(
            'backbone', 
            {
                credentialsGetter : {},
                tokenEndpoint : 'https://test.com/token'
            }
        );
        
        expect(requestManager).to.not.be.null();

    });
    
});