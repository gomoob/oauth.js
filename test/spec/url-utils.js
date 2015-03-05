describe('UrlUtils : ', function() {
    
    describe('when calling \'addArgument\' with a URL wihtout any arguments', function() {
        
        it('should generate a valid URL', function() {
                        
            expect(
                OAuth.UrlUtils.addArgument('http://rest.myserver.com', 'access_token', 'ACCESS_TOKEN_VALUE')
            ).to.equal('http://rest.myserver.com?access_token=ACCESS_TOKEN_VALUE');
            
        });

    });
    
    describe('When calling \'addArgument\' with a URL having arguments without the provided argument', function() {
        
        it('should generate a valid URL', function() {
            
            expect(
                OAuth.UrlUtils.addArgument(
                    'http://rest.myserver.com?a=A_VALUE&b=B_VALUE', 
                    'access_token', 
                    'ACCESS_TOKEN_VALUE'
                )
            ).to.equal('http://rest.myserver.com?a=A_VALUE&b=B_VALUE&access_token=ACCESS_TOKEN_VALUE');
            
        });
        
    });
    
    describe('When calling \'addArgument\' with a URL having arguments with the provided argument at the begining', function() {
        
        it('should generate a valid URL', function() {
            
            expect(
                OAuth.UrlUtils.addArgument(
                    'http://rest.myserver.com?access_token=ACCESS_TOKEN_VALUE&a=A_VALUE&b=B_VALUE', 
                    'access_token', 
                    'NEW_ACCESS_TOKEN_VALUE'
                )
            ).to.equal('http://rest.myserver.com?access_token=NEW_ACCESS_TOKEN_VALUE&a=A_VALUE&b=B_VALUE');
            
        });
        
    });
    
    describe('When calling \'addArgument\' with a URL having arguments with the provided argument at the end', function() {
        
        it('should generate a valid URL', function() {
            
            expect(
                OAuth.UrlUtils.addArgument(
                    'http://rest.myserver.com?a=A_VALUE&b=B_VALUE&access_token=ACCESS_TOKEN_VALUE', 
                    'access_token', 
                    'NEW_ACCESS_TOKEN_VALUE'
                )
            ).to.equal('http://rest.myserver.com?a=A_VALUE&b=B_VALUE&access_token=NEW_ACCESS_TOKEN_VALUE');
            
        });
        
    });
    
    describe('When calling \'addArgument\' with a URL having arguments with the provided argument at the middle', function() {
        
        it('should generate a valid URL', function() {
            
            expect(
                OAuth.UrlUtils.addArgument(
                    'http://rest.myserver.com?a=A_VALUE&access_token=ACCESS_TOKEN_VALUE&b=B_VALUE&c=C_VALUE', 
                    'access_token', 
                    'NEW_ACCESS_TOKEN_VALUE'
                )
            ).to.equal('http://rest.myserver.com?a=A_VALUE&access_token=NEW_ACCESS_TOKEN_VALUE&b=B_VALUE&c=C_VALUE');
            
        });
        
    });
    
});