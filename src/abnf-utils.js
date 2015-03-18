/**
 * Class used to provide utilities to manage Augmented Backus-Naur Form (ABNF) Syntax used in the OAuth 2.0 
 * specifications. Details about ABNF and OAuth 2.0 can be found in 
 * [Appendix A.](https://tools.ietf.org/html/rfc6749#appendix-A "Augmented Backus-Naur Form (ABNF) Syntax").
 * 
 * @author Baptiste GAILLARD (baptiste.gaillard@gomoob.com)
 * @class FunctionUtils
 * @memberof OAuth
 * @see https://tools.ietf.org/html/rfc6749#appendix-A
 */
OAuth.ABNFUtils = {
    
    /**
     * Function used to check if a string is compliant with a `grant-name` (i.e compliant with `1*name-char`).
     *  
     * @param {String} string The string to check.
     * 
     * @return {Boolean} True if the string is compliant with a `grant-name`, false otherwise.
     */
    isValidGrantName : function(string) {
  
        // TODO
        
    },
               
    /**
     * Function used to check if a string is compliant with a `grant-type` (i.e compliant with 
     * `grant-name / URI-reference`).
     *  
     * @param {String} string The string to check.
     * 
     * @return {Boolean} True if the string is compliant with a `grant-type`, false otherwise.
     */
    isValidGrantType : function(string) {
        
        // TODO
        
    },
    
    /**
     * Function used to check if a string is compliant with a `name-char` (i.e compliant with 
     * `"-" / "." / "_" / DIGIT / ALPHA`).
     *  
     * @param {String} string The string to check.
     * 
     * @return {Boolean} True if the string is compliant with a `name-char`, false otherwise.
     */
    isValidNameChar : function(string) {
        
        // TODO
        
    },

    /**
     * Function used to check if a string is compliant with `1*DIGIT`.
     * 
     * @param {String} string The string to check.
     * 
     * @return {Boolean} True if the string is compliant with `1*DIGIT`, false otherwise.
     */
    isValidOneStarDIGIT : function(string) {
        
        // TODO
        
    },
    
    /**
     * Function used to check if a string is compliant with `1*NQCHAR`.
     * 
     * @param {String} string The string to check.
     * 
     * @return {Boolean} True if the string is compliant with `1*NQCHAR` false otherwise.
     */
    isValidOneStarNQCHAR : function(string) {
        
        // TODO
        
    },
                   
    /**
     * Function used to check if a string is compliant with `1*NQSCHAR`.
     * 
     * @param {String} string The string to check.
     * 
     * @return {Boolean} True if the string is compliant with `1*NQSCHAR`, false otherwise.
     */
    isValidOneStarNQSCHAR : function(string) {
        
        // TODO
        
    },
    
    /**
     * Function used to check if a string is compliant with `1*VSCHAR`. 
     * 
     * @param {String} string The string to check.
     * 
     * @return {Boolean} True if the string is compliant with `1*VSCHAR`, false otherwise.
     */
    isValidOneStarVSCHAR : function(string) {
  
        // TODO
        
    },
    
    /**
     * Function used to check if a string is compliant with a `response-char` (i.e compliant with 
     * `"_" / DIGIT / ALPHA`).
     * 
     * @param {String} string The string to check.
     * 
     * @return {Boolean} True if the string is compliant with a `response-char`, false otherwise.
     * @see https://tools.ietf.org/html/rfc6749#appendix-A.3
     */
    isValidResponseChar : function(string) {
        
        // TODO
        
    },
    
    /**
     * Function used to check if a string is compliant with a `response-name` (i.e compliant with `1*response-char`).
     * 
     * @param {String} string The string to check.
     * 
     * @return {Boolean} True if the string is compliant with a `response-name`, false otherwise.
     * @see https://tools.ietf.org/html/rfc6749#appendix-A.3
     */
    isValidResponseName : function(string) {
        
        // TODO
        
    },
    
    /**
     * Function used to check if a string is compliant with a `response-type` (i.e compliant with 
     * `response-name *( SP response-name )`).
     * 
     * @param {String} string The string to check.
     */
    isValidResponseType : function(string) {
        
        // TODO
        
    },
    
    /**
     * Function used to indicate if a string is compliant with a `scope` (i.e `scope-token *( SP scope-token )`). 
     * 
     * @param {String} string The string to check.
     * 
     * @return {Boolean} True if the string is compliant with a `scope`, false otherwise.
     * @see https://tools.ietf.org/html/rfc6749#appendix-A.4
     */
    isValidScope : function(string) {
        
        // TODO
        
    },
    
    /**
     * Function used to indicate if a string is compliant with a `scope-token` (i.e `1*NQCHAR`).
     * 
     * @param {String} string The string to check.
     * 
     * @return {Boolean} True if the string is compliant with a `scope-token`, false otherwise.
     * @see https://tools.ietf.org/html/rfc6749#appendix-A.4
     */
    isValidScopeToken : function(string) {
        
        return this.isValidOneStarNQCHAR(string);
        
    },
                   
    /**
     * Function used to check if a string is compliant with `*NQCHAR`. 
     * 
     * @param {String} string The string to check.
     * 
     * @return {Boolean} True if the string is compliant with `*NQCHAR`, false otherwise.
     */
    isValidStarNQCHAR : function(string) {

        // TODO

    },
    
    /**
     * Function used to check if a string is compliant with `*UNICODECHARNOCRLF`. 
     * 
     * @param {String} string The string to check.
     * 
     * @return {Boolean} True if the string is compliant with `*UNICODECHARNOCRLF`, false otherwise.
     */
    isValidStarUNICODECHARNOCRLF : function(string) {
        
        // TODO
        
    },
    
    /**
     * Fuction used to check if a string is compliant with a `token-type` (i.e compliant with 
     * `type-name / URI-reference`).
     * 
     * @param {String} string The string to check.
     * 
     * @return {Boolean} True if the string is compliant with a `token-type`, false otherwise.
     */
    isValidTokenType : function(string) {
        
        // TODO
        
    },
    
    /**
     * Function used to check if a string is compliant with a `type-name` (i.e compliant with `1*name-char`).
     * 
     * @param {String} string The string to check.
     * 
     * @return {Boolean} True if the string is compliant with a `type-name, false otherwise.
     */
    isValidTypeName : function(string) {
        
        // TODO
        
    },
    
    /**
     * Function used to check if a string is compliant with `URI-reference`. 
     * 
     * @param {String} string The string to check.
     * 
     * @return {Boolean} True if the string is compliant with `URI-reference`, false otherwise.
     */
    isValidURIReference : function(string) {
        
        // TODO
        
    }

    
                   
};