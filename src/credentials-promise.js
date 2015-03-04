/**
 * Class which represents a Credentials Promise, a credentials promise is an object which is used to send credentials to 
 * an OAuth 2.0 server.
 * 
 * @author Baptiste GAILLARD (baptiste.gaillard@gomoob.com)
 * @class CredentialsPromise
 * @memberof OAuth
 */
OAuth.CredentialsPromise = function() {
    
    /**
     * A reference to the callback function passed to the `OAuth.login(cb, opts)` method.
     * 
     * @var {CredentialsPromise~loginCb}
     */
    this._loginCb = null;
    
    /**
     * A reference to the options passed to the `OAuth.login(cb, opts)` method.
     * 
     * @var {Object}
     */
    this._loginOpts = null;
    
    /**
     * A deferred object which is resolved when the 'login' method of the Credentials Promise is called.
     * 
     * @var {jQuery.Deferred}
     */
    this._deferred = null;
    
    /**
     * A reference to the OAuth.JS Request Manager which created this Credentials Promise object.
     * 
     * @var {OAuth.RequestManager}
     */
    this._requestManager = null;
    
};

OAuth.CredentialsPromise.prototype = {

    /**
     * Function to call to send credentials to an OAuth 2.0 server.
     * 
     * @param {Object} credentials 
     * @param {CredentialsPromise~loginFnCb}
     * @param {Object} opts
     */
    sendCredentials : function(credentials, loginFnCb, opts) {

        this._deferred.resolve(credentials, loginFnCb);
        
        return this._deferred;

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
     * Sets the deferred object which is resolved when the 'login' method of the Credentials Promise is called.
     * 
     * @param {jQuery.Deferred} deferred the deferred object which is resolved when the 'login' method of the 
     *        Credentials Promise is called.
     */
    _setDeferred : function(deferred) {

        this._deferred = deferred;
        
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
