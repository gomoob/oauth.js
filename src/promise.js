/**
 * Class which "simulates" an ES6 promise, this class is only used internally and does not implement all aspects of ES6 
 * promises. In fact its a very naive implementation, so DO NEVER use this class and believe its behavior is the same as 
 * ES6 promises !
 * 
 * @author Baptiste GAILLARD (baptiste.gaillard@gomoob.com)
 * @class Promise
 * @memberof OAuth
 * @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise
 */
OAuth.Promise = function(executor) {
    
    /**
     * An array of fullfillment listeners to be called when the promise is fullfilled.
     * 
     * @instance
     * @private
     * @type {Array}
     */
    _fullfillmentListeners = [];
    
    /**
     * An array of rejection listeners to be called when the promise is rejected.
     * 
     * @instance
     * @private
     * @type {Array}
     */
    _rejectionListeners = [];
    
    /**
     * The current state of the promise, available values are : 
     *  * `pending`   : initial state, not fulfilled or rejected.
     *  * `fulfilled` : successful operation
     *  * `rejected`  : failed operation.
     *  * `settled`   : the Promise is either fulfilled or rejected, but not pending.
     *  
     * @instance
     * @private
     * @type {String}
     */
    _state = 'pending';
    
    // Ensure the executor is a function
    if(typeof executor !== 'function') {
        
        throw new Error('You must provide an executor function !');
        
    }
    
    executor(
        function(value) {
            
            // We resolve the promise only if its state is equal to 'pending'
            if(_state === 'pending') {
            
                // Marks the promise as 'fullfilled'
                _state = 'fullfilled';
                
                // Call all the fullfillment listeners
                for(var i = 0; i < _fullfillmentListeners.length; ++i) {
    
                    _fullfillmentListeners[i](value);
    
                }
            }

        },
        function(value) {

            // We reject the promise only if its state is equal to 'pending'
            if(_state === 'pending') {
            
                // Marks the promise as 'rejected'
                _state = 'rejected';
                
                // Call all the rejection listeners
                for(var i = 0; i < _rejectionListeners.length; ++i) {
    
                    _rejectionListeners[i](value);
    
                }
                
            }
            
        }
    );
    
    /**
     * The then() method returns a Promise. It takes two arguments, both are callback functions for the success and 
     * failure cases of the Promise.
     * 
     * @param {Function} onFulfilled A Function called when the Promise is fulfilled. This function has one argument, 
     *        the fulfillment value.
     * @param {Function} onRejected A Function called when the Promise is rejected. This function has one argument, the 
     *        rejection reason.
     *        
     * @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise/then
     */
    this.then = function(onFulfilled, onRejected) {
        
        _fullfillmentListeners.push(onFulfilled);
        _rejectionListeners.push(onRejected);
        
        return this;
        
    };
    
};