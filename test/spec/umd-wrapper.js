/*jshint -W030 */

describe('OAuth : ', function() {
    
    it('create request manager with invalid framework', function() {
        
        expect(function() {
            OAuth.init(
                'unknown', 
                {
                    clientId : 'my-app',
                    loginFn : function(credentialsPromise) {},
                    parseErrorFn : function(xmlHttpRequest) {},
                    tokenEndpoint : 'https://test.com/token'
                }
            );
        }).to.throw(
            Error, 
            'Unknown or unsupported framework \'unknown\' !'
        );
        
    });
    
    it('create angular request manager', function() {
        
        OAuth.init(
            'angular', 
            {
                $provide : { decorator: function(name, decorator) {} },
                clientId : 'my-app',
                loginFn : function(credentialsPromise) {},
                parseErrorFn : function(xmlHttpRequest) {},
                tokenEndpoint : 'https://test.com/token'
            }
        );

    });
    
    it('create backbone request manager', function() {
        
        var requestManager = OAuth.init(
            'backbone', 
            {
                clientId : 'my-app',
                loginFn : function(credentialsPromise) {},
                parseErrorFn : function(xmlHttpRequest) {},
                tokenEndpoint : 'https://test.com/token'
            }
        );
        
        expect(requestManager).to.not.be.null;

    });
    
});