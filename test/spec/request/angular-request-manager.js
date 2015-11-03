/*jshint -W030 */

describe('OAuth.Request.AngularRequestManager', function() {
    
    describe('When calling \'_updateAngularHttpConfig(config)\'', function() {
        
        it('should return a valid configuration object', function() {
            
            // @see https://github.com/driverdan/node-XMLHttpRequest/issues/98
            XMLHttpRequest.DONE = 4;
            
            // Create an Angular Request Manager for our test
            var requestManager = new OAuth.Request.AngularRequestManager(
                {
                    clientId : 'my-app',
                    loginFn : function(loginContext) {},
                    parseErrorFn : function(xhr) {},
                    $provided : {},
                    tokenEndpoint : 'http://localhost/rest/tokens'
                }
            );
            
            // Create a fake XMLHttpRequest object and perist it with the Storage Manager attached to our Angular 
            // Request Manager. This will allow us to check if the 'access_token' parameter added to URLs is valid
            var xhr = new XMLHttpRequest();
            xhr.readyState = XMLHttpRequest.DONE;
            xhr.status = 200;
            xhr.statusText = 'OK';
            xhr.response = '{' +
                '"access_token":"aaaa_bbbb_cccc",' + 
                '"refresh_token":"refresh_token",' + 
                '"token_type":"Bearer",' +
                '"expires_in":3600' +
            '}';
            xhr.responseText = '{' +
                '"access_token":"aaaa_bbbb_cccc",' + 
                '"refresh_token":"refresh_token",' + 
                '"token_type":"Bearer",' +
                '"expires_in":3600' +
            '}';
            xhr.responseXML = null;
            
            requestManager._storageManager.persistAccessTokenResponse(xhr);
            
            // Test with a 'config' parameter which has no 'secured' parameter
            var expectedTransformRequest = function(data, headersGetter) {};
            var expectedTransformResponse = function(data, headersGetter, status) {};
            var updatedConfig = requestManager._updateAngularHttpConfig(
                {
                    method : 'GET',
                    url : 'http://localhost/rest/users',
                    params : {
                        param0 : 'param0_value',
                        param1 : 'param1_value'
                    },
                    data : 'the_data',
                    headers : {
                        'Accept' : '*/*'
                    },
                    xsrfHeaderName : 'xsrf_header_name',
                    xsrfCookieName : 'xsrf_cookie_name',
                    transformRequest : expectedTransformRequest,
                    transformResponse  : expectedTransformResponse,
                    cache : false,
                    timeout : 10,
                    withCredentials : false,
                    responseType : 'json'
                }
            );
            
            expect(Object.keys(updatedConfig).length).to.equal(13);
            expect(updatedConfig.method).to.equal('GET');
            expect(updatedConfig.url).to.equal('http://localhost/rest/users');
            expect(Object.keys(updatedConfig.params).length).to.equal(2);
            expect(updatedConfig.params.param0).to.equal('param0_value');
            expect(updatedConfig.params.param1).to.equal('param1_value');
            expect(updatedConfig.data).to.equal('the_data');
            expect(Object.keys(updatedConfig.headers).length).to.equal(1);
            expect(updatedConfig.headers.Accept).to.equal('*/*');
            expect(updatedConfig.xsrfHeaderName).to.equal('xsrf_header_name');
            expect(updatedConfig.xsrfCookieName).to.equal('xsrf_cookie_name');
            expect(updatedConfig.transformRequest).to.equal(expectedTransformRequest);
            expect(updatedConfig.transformResponse).to.equal(expectedTransformResponse); 
            expect(updatedConfig.cache).to.be.false;
            expect(updatedConfig.timeout).to.equal(10);
            expect(updatedConfig.withCredentials).to.be.false;
            expect(updatedConfig.responseType).to.equal('json');
            
            // Test with a 'config' parameter which has a 'secured' parameter equals to 'false'
            updatedConfig = requestManager._updateAngularHttpConfig(
                {
                    method : 'GET',
                    url : 'http://localhost/rest/users',
                    params : {
                        param0 : 'param0_value',
                        param1 : 'param1_value'
                    },
                    data : 'the_data',
                    headers : {
                        'Accept' : '*/*'
                    },
                    xsrfHeaderName : 'xsrf_header_name',
                    xsrfCookieName : 'xsrf_cookie_name',
                    transformRequest : expectedTransformRequest,
                    transformResponse  : expectedTransformResponse,
                    cache : false,
                    timeout : 10,
                    withCredentials : false,
                    responseType : 'json',
                    secured : false
                }
            );
            
            expect(Object.keys(updatedConfig).length).to.equal(13);
            expect(updatedConfig.method).to.equal('GET');
            expect(updatedConfig.url).to.equal('http://localhost/rest/users');
            expect(Object.keys(updatedConfig.params).length).to.equal(2);
            expect(updatedConfig.params.param0).to.equal('param0_value');
            expect(updatedConfig.params.param1).to.equal('param1_value');
            expect(updatedConfig.data).to.equal('the_data');
            expect(Object.keys(updatedConfig.headers).length).to.equal(1);
            expect(updatedConfig.headers.Accept).to.equal('*/*');
            expect(updatedConfig.xsrfHeaderName).to.equal('xsrf_header_name');
            expect(updatedConfig.xsrfCookieName).to.equal('xsrf_cookie_name');
            expect(updatedConfig.transformRequest).to.equal(expectedTransformRequest);
            expect(updatedConfig.transformResponse).to.equal(expectedTransformResponse); 
            expect(updatedConfig.cache).to.be.false;
            expect(updatedConfig.timeout).to.equal(10);
            expect(updatedConfig.withCredentials).to.be.false;
            expect(updatedConfig.responseType).to.equal('json');
            
            // Test with a 'config' parameter which has a 'secured' parameter equals to 'true' and a URL which has no 
            // 'access_token' parameter
            updatedConfig = requestManager._updateAngularHttpConfig(
                {
                    method : 'GET',
                    url : 'http://localhost/rest/users',
                    params : {
                        param0 : 'param0_value',
                        param1 : 'param1_value'
                    },
                    data : 'the_data',
                    headers : {
                        'Accept' : '*/*'
                    },
                    xsrfHeaderName : 'xsrf_header_name',
                    xsrfCookieName : 'xsrf_cookie_name',
                    transformRequest : expectedTransformRequest,
                    transformResponse  : expectedTransformResponse,
                    cache : false,
                    timeout : 10,
                    withCredentials : false,
                    responseType : 'json',
                    secured : true
                }
            );
            
            expect(Object.keys(updatedConfig).length).to.equal(13);
            expect(updatedConfig.method).to.equal('GET');
            expect(updatedConfig.url).to.equal('http://localhost/rest/users?access_token=aaaa_bbbb_cccc');
            expect(Object.keys(updatedConfig.params).length).to.equal(2);
            expect(updatedConfig.params.param0).to.equal('param0_value');
            expect(updatedConfig.params.param1).to.equal('param1_value');
            expect(updatedConfig.data).to.equal('the_data');
            expect(Object.keys(updatedConfig.headers).length).to.equal(1);
            expect(updatedConfig.headers.Accept).to.equal('*/*');
            expect(updatedConfig.xsrfHeaderName).to.equal('xsrf_header_name');
            expect(updatedConfig.xsrfCookieName).to.equal('xsrf_cookie_name');
            expect(updatedConfig.transformRequest).to.equal(expectedTransformRequest);
            expect(updatedConfig.transformResponse).to.equal(expectedTransformResponse); 
            expect(updatedConfig.cache).to.be.false;
            expect(updatedConfig.timeout).to.equal(10);
            expect(updatedConfig.withCredentials).to.be.false;
            expect(updatedConfig.responseType).to.equal('json');
            
            // Test with a 'config' parameter which has a 'secured' parameter equals to 'true' and a URL which already 
            // has an 'access_token' parameter
            updatedConfig = requestManager._updateAngularHttpConfig(
                {
                    method : 'GET',
                    url : 'http://localhost/rest/users?access_token=lkjhsdljglkgqsdkjhg',
                    params : {
                        param0 : 'param0_value',
                        param1 : 'param1_value'
                    },
                    data : 'the_data',
                    headers : {
                        'Accept' : '*/*'
                    },
                    xsrfHeaderName : 'xsrf_header_name',
                    xsrfCookieName : 'xsrf_cookie_name',
                    transformRequest : expectedTransformRequest,
                    transformResponse  : expectedTransformResponse,
                    cache : false,
                    timeout : 10,
                    withCredentials : false,
                    responseType : 'json',
                    secured : true
                }
            );
            
            expect(Object.keys(updatedConfig).length).to.equal(13);
            expect(updatedConfig.method).to.equal('GET');
            expect(updatedConfig.url).to.equal('http://localhost/rest/users?access_token=aaaa_bbbb_cccc');
            expect(Object.keys(updatedConfig.params).length).to.equal(2);
            expect(updatedConfig.params.param0).to.equal('param0_value');
            expect(updatedConfig.params.param1).to.equal('param1_value');
            expect(updatedConfig.data).to.equal('the_data');
            expect(Object.keys(updatedConfig.headers).length).to.equal(1);
            expect(updatedConfig.headers.Accept).to.equal('*/*');
            expect(updatedConfig.xsrfHeaderName).to.equal('xsrf_header_name');
            expect(updatedConfig.xsrfCookieName).to.equal('xsrf_cookie_name');
            expect(updatedConfig.transformRequest).to.equal(expectedTransformRequest);
            expect(updatedConfig.transformResponse).to.equal(expectedTransformResponse); 
            expect(updatedConfig.cache).to.be.false;
            expect(updatedConfig.timeout).to.equal(10);
            expect(updatedConfig.withCredentials).to.be.false;
            expect(updatedConfig.responseType).to.equal('json');

        });
        
    });
    
});