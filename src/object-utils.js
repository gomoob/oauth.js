/**
 * Class used to provide utilities to manipulate objects.
 *
 * Please note that several function defined here are copies of Underscore.js functions.
 *
 * @author Baptiste GAILLARD (baptiste.gaillard@gomoob.com)
 * @class ObjectUtils
 * @memberof OAuth
 * @see http://underscorejs.org/underscore.js
 */
OAuth.ObjectUtils = {

    /**
     * Copy all of the properties in the source objects over to the destination object, and return the destination
     * object. It's in-order, so the last source will override properties of the same name in previous arguments.
     *
     * @param destination The destination object to copy properties to.
     * @param source The source object from which one to copy properties.
     *
     * @returns The modified destination object.
     */
    extend : function(destination, source) {

        for(var propertyName in source) {

            destination[propertyName] = source[propertyName];

        }

        return destination;

    },

    /**
     * Returns true if value is an Object. Note that JavaScript arrays and functions are objects, while (normal) strings
     * and numbers are not.
     *
     * Note that JavaScript arrays and functions are objects, while (normal) strings and numbers are not.
     *
     * @param {*} obj The value to check.
     * @returns {Boolean} True if the value is an object or a function, false otherwise.
     */
    isObject : function(obj) {

        // Do not modify this peace of code because its a pure copy of Underscore JS '_.isObject(value)'
        // @see http://underscorejs.org/#isObject
        var type = typeof obj;
        return type === 'function' || type === 'object' && !!obj;

    }

};
