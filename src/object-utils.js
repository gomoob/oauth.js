/**
 * Class used to provide utilities to manipulate objects.
 * 
 * @author Baptiste GAILLARD (baptiste.gaillard@gomoob.com)
 * @class ObjectUtils
 * @memberof OAuth
 */
OAuth.ObjectUtils = {

    /**
     * Returns true if value is an Object. Note that JavaScript arrays and functions are objects, while (normal) strings 
     * and numbers are not.
     * 
     * @param {*} obj The value to check.
     * 
     * @returns {Boolean} True if the value is an object or a function, false otherwise.
     */
    isObject : function(obj) {
        
        // Do not modify this peace of code because its a pure copy of Underscore JS '_.isObject(value)'
        // @see http://underscorejs.org/#isObject
        var type = typeof obj;
        return type === 'function' || type === 'object' && !!obj;

    }
                     
};