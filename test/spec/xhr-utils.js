/*jshint -W030 */

describe('OAuth.XhrUtils', function() {
    
    describe('when calling \'copyAttributes\'', function() {
        
        it('should copy all attributes', function() {
            
            var fromXhr = new XMLHttpRequest(),
                toXhr = new XMLHttpRequest();
            
            // Initialize the 'fromXhr'
            fromXhr.readyState = 0;
            fromXhr.timeout = 10;
            fromXhr.withCredentials = true;
            fromXhr.responseURL = 'http://localhost/from-xhr';
            fromXhr.status = 401;
            fromXhr.statusText = 'Unauthorized';
            fromXhr.responseType = 'document';
            fromXhr.response = 'From Response';
            fromXhr.responseText = 'From Response Text';
            fromXhr.responseXML = 'From Response XML';
            
            // Initialize the 'toXhr'
            toXhr.readyState = 4;
            toXhr.timeout = 100;
            toXhr.withCredentials = false;
            toXhr.responseURL = 'http://localhost/to-xhr';
            toXhr.status = 200;
            toXhr.statusText = 'OK';
            toXhr.responseType = 'text';
            toXhr.response = 'To Response';
            toXhr.responseText = 'To Response Text';
            toXhr.responseXML = 'To Response XML';
            
            OAuth.XhrUtils.copyAttributes(fromXhr, toXhr);
            expect(toXhr.readyState).to.equal(0);
            expect(toXhr.timeout).to.equal(10);
            expect(toXhr.withCredentials).to.be.true;
            expect(toXhr.responseURL).to.equal('http://localhost/from-xhr');
            expect(toXhr.status).to.equal(401);
            expect(toXhr.statusText).to.equal('Unauthorized');
            expect(toXhr.responseType).to.equal('document');
            expect(toXhr.response).to.equal('From Response');
            expect(toXhr.responseText).to.equal('From Response Text');
            expect(toXhr.responseXML).to.equal('From Response XML');
            
        });
        
    });
    
    describe('when calling \'toJSON\'', function() {
        
        it('should return a valid object', function() {
            
            // Create a fake XMLHttpRequest object
            // @see https://github.com/driverdan/node-XMLHttpRequest/blob/master/lib/XMLHttpRequest.js
            var xhr = new XMLHttpRequest();
            xhr.readyState = xhr.DONE;
            xhr.status = 200;
            xhr.statusText = 'OK';
            xhr.response = 'RESPONSE';
            xhr.responseText = 'RESPONSE_TEXT';
            xhr.responseXML = 'RESPONSE_XML';
            
            var jsonObject = OAuth.XhrUtils.toJSON(xhr);
            
            expect(Object.keys(jsonObject).length).to.equal(6);
            expect(jsonObject.hasOwnProperty('readyState')).to.be.true;
            expect(jsonObject.hasOwnProperty('status')).to.be.true;
            expect(jsonObject.hasOwnProperty('statusText')).to.be.true;
            expect(jsonObject.hasOwnProperty('response')).to.be.true;
            expect(jsonObject.hasOwnProperty('responseText')).to.be.true;
            expect(jsonObject.hasOwnProperty('responseXML')).to.be.true;
            expect(jsonObject.readyState).to.equal(xhr.DONE);
            expect(jsonObject.status).to.equal(200);
            expect(jsonObject.statusText).to.equal('OK');
            expect(jsonObject.response).to.equal('RESPONSE');
            expect(jsonObject.responseText).to.equal('RESPONSE_TEXT');
            expect(jsonObject.responseXML).to.equal('RESPONSE_XML');

        });

    });
    
});
