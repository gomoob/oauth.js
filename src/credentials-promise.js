/**
 * Class which represents a Credentials Promise, a credentials promise is an object which is used to send credentials to 
 * an OAuth 2.0 server.
 * 
 * @author Baptiste GAILLARD (baptiste.gaillard@gomoob.com)
 * @class CredentialsPromise
 * @memberof OAuth
 */
// TODO: Je pense que ceci devrait être renommé en LoginContext
OAuth.CredentialsPromise = function() {

    /**
     * The credentials provided.
     * 
     * @var {Object}
     */
    this._credentials = null;
    
    /**
     * A reference to the callback function passed to the `OAuth.login(cb, opts)` method.
     * 
     * @var {CredentialsPromise~loginCb}
     */
    this._loginCb = null;
    
    this._loginFnCb = null;
    
    this._loginFnOpts = null;
    
    /**
     * A reference to the options passed to the `OAuth.login(cb, opts)` method.
     * 
     * @var {Object}
     */
    this._loginOpts = null;

    /**
     * A reference to the OAuth.JS Request Manager which created this Credentials Promise object.
     * 
     * @var {OAuth.RequestManager}
     */
    this._requestManager = null;
    
};

OAuth.CredentialsPromise.prototype = {

    /**
     * Gets the last credentials provided.
     * 
     * @return {Object} The last credentials provided.
     */
    getCredentials : function() {
        
        return this._credentials;
        
    },
    
    /**
     * Gets a reference to the callback function passed to the `OAuth.login(loginCb, opts)` method.
     * 
     * @returns {CredentialsPromise~loginCb} loginCb A reference to the callback function passed to the 
     *          `OAuth.login(cb, opts)` method.
     */
    getLoginCb : function() {
        
        return this._loginCb;
        
    },
    
    getLoginFnCb : function() {
        
        return this._loginFnCb;
        
    },
                                      
    /**
     * Function to call to send credentials to an OAuth 2.0 server.
     * 
     * @param {Object} credentials 
     * @param {CredentialsPromise~loginFnCb}
     * @param {Object} loginFnOpts
     */
    sendCredentials : function(credentials, loginFnCb, loginFnOpts) {

        // Backups the provided credentials, login function callback and login function options. This is important 
        // because those information can then be used by the request manager
        this._credentials = credentials;
        this._loginFnCb = loginFnCb;
        this._loginFnOpts = loginFnOpts;
        
        // Sends the credentials with OAuth.JS
        // TODO: Ici il serait beaucoup plus propre de lever un événement intercepter par le Request Manager pour ne pas 
        //       avoir de dépendance vers le Request Manager
        this._requestManager._login(this, credentials, loginFnCb);

    }, 
    
    /**
     * Sets a reference to the callback function passed to the `OAuth.login(cb, opts)` method.
     * 
     * @param {CredentialsPromise~loginCb} loginCb A reference to the callback function passed to the 
     *        `OAuth.login(cb, opts)` method.
     */
    _setLoginCb : function(loginCb) {
        
        this._loginCb = loginCb;
        
    },
    
    /**
     * Sets a reference to the options passed to the `OAuth.login(cb, opts)` method.
     * 
     * @param {Object} loginOpts A reference to the options passed to the `OAuth.login(cb, opts)` method.
     */
    _setLoginOpts : function(loginOpts) {
        
        this._loginOpts = loginOpts;

    },
    
    /**
     * Sets the Request Manager which created this Credentials Promise.
     * 
     * @param {OAuth.RequestManager} requestManager The Request Manager which created this Credentials Promise.
     */
    _setRequestManager : function(requestManager) {
        
        this._requestManager = requestManager;
        
    }
                                 
};
