/*jshint -W030 */

describe('OAuth.XhrUtils', function() {
    
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
