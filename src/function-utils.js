/**
 * Class used to provide function utilities.
 * 
 * @author Baptiste GAILLARD (baptiste.gaillard@gomoob.com)
 * @class FunctionUtils
 * @memberof OAuth
 */
OAuth.FunctionUtils = {
                   
    /**
     * Bind a function to an object, meaning that whenever the function is called, the value of this will be the object. 
     * Optionally, pass arguments to the function to pre-fill them, also known as partial application.
     * 
     * NOTE: This function is the same as the Underscore JS '_.bind(func, context)' function.
     * 
     * @param func The function to bind.
     * @param context The context object.
     * 
     * @returns The bound function.
     * 
     * @see http://documentcloud.github.io/underscore/docs/underscore.html#section-63
     */
    bind : function(func, context) {

        // @see http://documentcloud.github.io/underscore/docs/underscore.html#section-62
        // @see http://documentcloud.github.io/underscore/docs/underscore.html#section-9 
        var ctor = function(){},
            slice = Array.prototype.slice, 
            nativeBind = Function.prototype.bind;

        // Do not modify this peace of code because its a pure copy of Underscore JS '_.bind(func, context)'
        // @see http://documentcloud.github.io/underscore/docs/underscore.html#section-63
        /* jshint ignore:start */
        var args, bound;
        if (nativeBind && func.bind === nativeBind) { return nativeBind.apply(func, slice.call(arguments, 1)); }
        if (typeof func !== 'function') throw new TypeError;
        args = slice.call(arguments, 2);
        return bound = function() {
          if (!(this instanceof bound)) return func.apply(context, args.concat(slice.call(arguments)));
          ctor.prototype = func.prototype;
          var self = new ctor;
          ctor.prototype = null;
          var result = func.apply(self, args.concat(slice.call(arguments)));
          if (Object(result) === result) return result;
          return self;
        };
        /* jshint ignore:end */

    }
                       
};
