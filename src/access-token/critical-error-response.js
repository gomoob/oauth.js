/**
 * Class used to represent a Critical Error OAuth 2.0 Access Token response.
 * 
 * Critial error codes ARE NOT DEFINED by the OAuth 2.0 RFC and are used by OAuth.JS when the server returned invalid 
 * responses (i.e which are not compliant with the OAuth 2.0 RFC). Critical errors have error codes which are compliant 
 * with the following template : '__oauth__js__${errorCode}__'.
 * 
 * @author Baptiste GAILLARD (baptiste.gaillard@gomoob.com)
 */
OAuth.AccessToken.CriticalErrorResponse = function() {
    
    // The CriticalResponse extends the ErrorResponse
    OAuth.AccessToken.ErrorResponse.apply(this, arguments);
    
    // At the begining the error has a default code
    this.setError('__oauth__js__uninitialized__');
    
    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    // PRIVATE MEMBERS
    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    // PUBLIC MEMBERS
    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

};

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// STATIC MEMBERS
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

/**
 * An array which stores critical error codes. Critial error codes ARE NOT DEFINED by the OAuth 2.0 RFC and are used 
 * by OAuth.JS when the server returned invalid responses (i.e which are not compliant with the OAuth 2.0 RFC). 
 * Critical errors have error codes which are compliant with the following template : '__oauth__js__${errorCode}__'.
 * 
 * @instance
 * @private
 * @type {String[]}
 */
OAuth.AccessToken.CriticalErrorResponse.criticalErrorCodes = [

    // TODO: A documenter, cette documentation doit apparaître dans le JSDoc, on doit avoir une référence à la règle 
    //       des spécifications OAuth 2.0 qui est violée
    '__oauth_js__headers_bad_cache_control__',

    // TODO: A documenter, cette documentation doit apparaître dans le JSDoc, on doit avoir une référence à la règle 
    //       des spécifications OAuth 2.0 qui est violée
    '__oauth_js__headers_bad_media_type__',
    
    // TODO: A documenter, cette documentation doit apparaître dans le JSDoc, on doit avoir une référence à la règle 
    //       des spécifications OAuth 2.0 qui est violée
    '__oauth_js__headers_bad_pragma__',
                           
    // TODO: A documenter, cette documentation doit apparaître dans le JSDoc, on doit avoir une référence à la règle 
    //       des spécifications OAuth 2.0 qui est violée
    '__oauth_js__entity_body_invalid_json__',
    
    // TODO: A documenter, cette documentation doit apparaître dans le JSDoc, on doit avoir une référence à la règle 
    //       des spécifications OAuth 2.0 qui est violée
    '__oauth_js__entity_body_not_json__',

    // TODO: A documenter, cette documentation doit apparaître dans le JSDoc, on doit avoir une référence à la règle 
    //       des spécifications OAuth 2.0 qui est violée
    '__oauth_js__status_lt_1xx__',
    
    // TODO: A documenter, cette documentation doit apparaître dans le JSDoc, on doit avoir une référence à la règle 
    //       des spécifications OAuth 2.0 qui est violée
    '__oauth_js__status_1xx__',
    
    // TODO: A documenter, cette documentation doit apparaître dans le JSDoc, on doit avoir une référence à la règle 
    //       des spécifications OAuth 2.0 qui est violée
    '__oauth_js__status_2xx__',
    
    // TODO: A documenter, cette documentation doit apparaître dans le JSDoc, on doit avoir une référence à la règle 
    //       des spécifications OAuth 2.0 qui est violée
    '__oauth_js__status_3xx__',
    
    // TODO: A documenter, cette documentation doit apparaître dans le JSDoc, on doit avoir une référence à la règle 
    //       des spécifications OAuth 2.0 qui est violée
    '__oauth_js__status_4xx__',
    
    // TODO: A documenter, cette documentation doit apparaître dans le JSDoc, on doit avoir une référence à la règle 
    //       des spécifications OAuth 2.0 qui est violée
    '__oauth_js__status_5xx__',
    
    // TODO: A documenter, cette documentation doit apparaître dans le JSDoc, on doit avoir une référence à la règle 
    //       des spécifications OAuth 2.0 qui est violée
    '__oauth_js__status_gt_5xx__',
    
    // TODO: A documenter, cette documentation doit apparaître dans le JSDoc, on doit avoir une référence à la règle 
    //       des spécifications OAuth 2.0 qui est violée
    '__oauth_js__uninitialized__'

];
