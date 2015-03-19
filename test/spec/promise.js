/*jshint -W030 */

describe('OAuth.Promise : ', function() {
    
    /**
     * A component used to test ES6 Promise 'resolve' or 'reject' listeners.
     */
    var ListenerManager = function() {
        
        /**
         * The reason provided while calling 'reject(reason)' or the value provided by calling 
         * 'resolve(value)'.
         * 
         * @instance
         * @private
         * @type {String}
         */
        var _reasonOrValue = '__not_called__';
        
        /**
         * The total number of times the then 'onFulfilled(value)' or 'onRejected(reason)' callback has been 
         * called.
         * 
         * @instance
         * @private
         * @type {Integer}
         */
        var _numberOfCalls = 0;
        
        /**
         * Gets the total number of times the then 'onFulfilled(value)' or 'onRejected(reason)' callback has 
         * been called.
         * 
         * @return {Integer} The total number of times the then 'onFulfilled(value)' or 'onRejected(reason)' 
         *         callback has been called.
         */
        this.getNumberOfCalls = function() {
            return _numberOfCalls;
        };
        
        /**
         * Gets the reason provided while calling 'reject(reason)' or the value provided by calling 
         * 'resolve(value)'.
         * 
         * @return {String} The reason provided while calling 'reject(reason)' or the value provided by 
         *         calling 'resolve(value)'.
         */
        this.getReasonOrValue = function() {
            return _reasonOrValue;
        };
        
        /**
         * The listener provided by this listener manager.
         * 
         * @param {String} The reason provided while calling 'reject(reason)' or the value provided by 
         *         calling 'resolve(value)'.
         */
        this.listener = function(reasonOrValue) {
            _numberOfCalls++;
            _reasonOrValue = reasonOrValue;
        };
    };
    
    describe('When calling the constructor withtout a valid executor', function() {
        
        it('should throw an error', function() {

            // Test without any parameter
            expect(function() {
                return new OAuth.Promise();
            }).to.throw(
                Error, 
                'You must provide an executor function !'
            );
            
            // Test with a bad parameter
            expect(function() {
                return new OAuth.Promise('bad');
            }).to.throw(
                Error, 
                'You must provide an executor function !'
            );
            

        });

    });
    
    describe('When calling \'then()\' and rejecting the promise', function() {
        
        it('should call all the fullfillment listeners', function() {
            
            var resolveOrReject = null,
                promise = new OAuth.Promise(
                    function(resolve, reject) { resolveOrReject = { resolve : resolve, reject : reject }; }
                ),
                listenerManager1 = new ListenerManager(),
                listenerManager2 = new ListenerManager(),
                listenerManager3 = new ListenerManager(),
                listenerManager4 = new ListenerManager();

            // Binds our fullfillment and rejection listeners
            promise.then(listenerManager1.listener, listenerManager2.listener);
            promise.then(listenerManager3.listener, listenerManager4.listener);

            // Without calling 'resolve' or 'reject' no listener should have been called
            expect(listenerManager1.getNumberOfCalls()).to.equal(0);
            expect(listenerManager1.getReasonOrValue()).to.equal('__not_called__');
            expect(listenerManager2.getNumberOfCalls()).to.equal(0);
            expect(listenerManager2.getReasonOrValue()).to.equal('__not_called__');
            expect(listenerManager3.getNumberOfCalls()).to.equal(0);
            expect(listenerManager3.getReasonOrValue()).to.equal('__not_called__');
            expect(listenerManager4.getNumberOfCalls()).to.equal(0);
            expect(listenerManager4.getReasonOrValue()).to.equal('__not_called__');
            
            // Reject the promise
            resolveOrReject.reject('REJECT_REASON');
            expect(listenerManager1.getNumberOfCalls()).to.equal(0);
            expect(listenerManager1.getReasonOrValue()).to.equal('__not_called__');
            expect(listenerManager2.getNumberOfCalls()).to.equal(1);
            expect(listenerManager2.getReasonOrValue()).to.equal('REJECT_REASON');
            expect(listenerManager3.getNumberOfCalls()).to.equal(0);
            expect(listenerManager3.getReasonOrValue()).to.equal('__not_called__');
            expect(listenerManager4.getNumberOfCalls()).to.equal(1);
            expect(listenerManager4.getReasonOrValue()).to.equal('REJECT_REASON');
            
            // Rejecting the promise a second time must not trigger a second listener call
            resolveOrReject.reject('REJECT_REASON');
            expect(listenerManager1.getNumberOfCalls()).to.equal(0);
            expect(listenerManager1.getReasonOrValue()).to.equal('__not_called__');
            expect(listenerManager2.getNumberOfCalls()).to.equal(1);
            expect(listenerManager2.getReasonOrValue()).to.equal('REJECT_REASON');
            expect(listenerManager3.getNumberOfCalls()).to.equal(0);
            expect(listenerManager3.getReasonOrValue()).to.equal('__not_called__');
            expect(listenerManager4.getNumberOfCalls()).to.equal(1);
            expect(listenerManager4.getReasonOrValue()).to.equal('REJECT_REASON');
            
        });
        
    });
    
    describe('When calling \'then()\' and resolving the promise', function() {
        
        it('should call all the fullfillment listeners', function() {
            
            var resolveOrReject = null,
                promise = new OAuth.Promise(
                    function(resolve, reject) { resolveOrReject = { resolve : resolve, reject : reject }; }
                ), 
                listenerManager1 = new ListenerManager(),
                listenerManager2 = new ListenerManager(),
                listenerManager3 = new ListenerManager(),
                listenerManager4 = new ListenerManager();

            // Binds our fullfillment and rejection listeners
            promise.then(listenerManager1.listener, listenerManager2.listener);
            promise.then(listenerManager3.listener, listenerManager4.listener);

            // Without calling 'resolve' or 'reject' no listener should have been called
            expect(listenerManager1.getNumberOfCalls()).to.equal(0);
            expect(listenerManager1.getReasonOrValue()).to.equal('__not_called__');
            expect(listenerManager2.getNumberOfCalls()).to.equal(0);
            expect(listenerManager2.getReasonOrValue()).to.equal('__not_called__');
            expect(listenerManager3.getNumberOfCalls()).to.equal(0);
            expect(listenerManager3.getReasonOrValue()).to.equal('__not_called__');
            expect(listenerManager4.getNumberOfCalls()).to.equal(0);
            expect(listenerManager4.getReasonOrValue()).to.equal('__not_called__');
            
            // Resolve the promise
            resolveOrReject.resolve('RESOLVE_VALUE');
            expect(listenerManager1.getNumberOfCalls()).to.equal(1);
            expect(listenerManager1.getReasonOrValue()).to.equal('RESOLVE_VALUE');
            expect(listenerManager2.getNumberOfCalls()).to.equal(0);
            expect(listenerManager2.getReasonOrValue()).to.equal('__not_called__');
            expect(listenerManager3.getNumberOfCalls()).to.equal(1);
            expect(listenerManager3.getReasonOrValue()).to.equal('RESOLVE_VALUE');
            expect(listenerManager4.getNumberOfCalls()).to.equal(0);
            expect(listenerManager4.getReasonOrValue()).to.equal('__not_called__');
            
            // Resolving the promise a second time must not trigger a second listener call
            resolveOrReject.resolve('RESOLVE_VALUE');
            expect(listenerManager1.getNumberOfCalls()).to.equal(1);
            expect(listenerManager1.getReasonOrValue()).to.equal('RESOLVE_VALUE');
            expect(listenerManager2.getNumberOfCalls()).to.equal(0);
            expect(listenerManager2.getReasonOrValue()).to.equal('__not_called__');
            expect(listenerManager3.getNumberOfCalls()).to.equal(1);
            expect(listenerManager3.getReasonOrValue()).to.equal('RESOLVE_VALUE');
            expect(listenerManager4.getNumberOfCalls()).to.equal(0);
            expect(listenerManager4.getReasonOrValue()).to.equal('__not_called__');
            
        });
        
    });
});