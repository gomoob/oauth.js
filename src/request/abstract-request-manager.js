/**
 * Abstract class common to all OAuth.JS Request Managers.
 * 
 * @author Baptiste GAILLARD (baptiste.gaillard@gomoob.com)
 */
OAuth.Request.AbstractRequestManager = function(configuration) {
    
    /**
     * The storage manager used to manage persistence of OAuth 2.0 tokens on client side.
     * 
     * @instance
     * @private
     * @type {OAuth.StorageManager}
     */
    this._storageManager = null;

};
