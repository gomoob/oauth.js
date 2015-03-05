/**
 * Utility class used to manipulate URLs.
 * 
 * @author Baptiste GAILLARD (baptiste.gaillard@gomoob.com)
 * @class UrlUtils
 * @memberof OAuth
 */
OAuth.UrlUtils = {

    /**
     * Utility function used to append an argument to a URL, if the argument is already present in the URL this argument
     * value is updated with the new argument value.
     * 
     * @param {String} url The string into which one to add an argument.
     * @param {String} name The name of the argument to add.
     * @param {String} value The value of the argument to add.
     * 
     * @param {String} The URL with the added argument.
     */
    addArgument : function(url, name, value) {
        
        var updatedUrl = url, 
            nameEqual = name + '=',
            argumentPos = url.indexOf(nameEqual);
        
        // If the provided URL has already parameters
        if(url.indexOf('?') !== -1) {
            
            // If the provided URL already has the argument
            if(argumentPos !== -1) {
                
                // Creates a URL prefix 'http://a.b.com?a=1&b=2&name=' and a URL suffix 'value=xxx&c=3&d=4'
                var prefix = updatedUrl.substring(0, argumentPos + nameEqual.length), 
                    suffix = updatedUrl.substring(prefix.length), 
                    nextArgumentPos = suffix.indexOf('&');
                
                // Their is no additional argument in the suffix so we can safely rebuild the URL with the new argument 
                // value
                if(nextArgumentPos === -1) {
                    
                    updatedUrl = prefix + value;
                    
                } 
                
                // Otherwise we remove the old argument value from the suffix and rebuild the URL with the new argument 
                // value
                else {
                    
                    suffix = suffix.substring(nextArgumentPos);
                    updatedUrl = prefix + value + suffix;

                }
                
            } 
            
            // Otherwise we can safely add the URL argument at the end of the URL
            else {
                
                updatedUrl = updatedUrl + '&' + nameEqual + value;    
                
            }
        } 
        
        // Otherwise we can safely add the URL argument
        else {
            
            updatedUrl = updatedUrl + '?' + nameEqual + value;

        }

        return updatedUrl;

    }
                  
};
