/*jshint -W030 */

describe('OAuth.ObjectUtils : ', function() {
    
    describe('When calling extend(source, destination)', function() {
        
        it('With non empty source and destination', function() {
           
            var destination = {
                a : 'a',
                b : 'b'
            }, source = {
                c : 'c',
                d : 'd'
            };
            
            var result = OAuth.ObjectUtils.extend(destination, source);
            
            expect(result).to.equal(destination);
            expect(destination).to.include.keys('a');
            expect(destination).to.include.keys('b');
            expect(destination).to.include.keys('c');
            expect(destination).to.include.keys('d');
            expect(destination.a).to.equal('a');
            expect(destination.b).to.equal('b');
            expect(destination.c).to.equal('c');
            expect(destination.d).to.equal('d');
            expect(Object.keys(destination).length).to.equal(4);

        });
        
    });
    
    describe('When calling isObject(obj)', function() {
        
        it('with an array should return true', function() {
            
            expect(OAuth.ObjectUtils.isObject([])).to.be.true;
            
        });
        
        it('with a function should return true', function() {
            
            expect(OAuth.ObjectUtils.isObject(function() {})).to.be.true;
            
        });
        
        it('with an object should return true', function() {
    
            expect(OAuth.ObjectUtils.isObject({})).to.be.true;
            
        });
        
        it('with a string should return false', function() {
            
            expect(OAuth.ObjectUtils.isObject('string')).to.be.false;
            
        });
        
        it('with null should return false', function() {
            
            expect(OAuth.ObjectUtils.isObject(null)).to.be.false;
            
        });
        
    });
    
});
    