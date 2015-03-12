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
    
    describe('When calling \'toQueryString\' with an argument which is not an object', function() {
        
        it('should throw an error', function() {
            
            expect(
                OAuth.UrlUtils.toQueryString.bind(OAuth.UrlUtils, 'bad')
            ).to.throw('The provided argument must be an object !');
            
        });
        
    });
    
    describe('When calling \'toQueryString\' with an empty object', function() {
    
        it('should return an empty string', function() {
            
            expect(OAuth.UrlUtils.toQueryString({})).to.equal('');
            
        });
        
    });
    
    describe('When calling \'toQueryString\' with an object', function() {
        
        it('should create a valid string', function() {
            
            expect(
                OAuth.UrlUtils.toQueryString({a: 'a_value', b: 'b_value', c: 'c_value'})
            ).to.equal('a=a_value&b=b_value&c=c_value');

        });
        
    });
    
});