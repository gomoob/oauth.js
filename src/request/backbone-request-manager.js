/**
 *
 * @author Baptiste GAILLARD (baptiste.gaillard@gomoob.com)
 */ 
BackboneRequestManager = function(configuration) {
    
    /**
     * A reference to the original `Backbone.ajax` method.
     */
    this._backupedBackboneDotAjax = null;
    
    /**
     * A string which identify the type of client this request manager is overwriting.
     */
    this._clientType = 'backbone';

    /**
     * The error parser used to manage errors returned by the Web Services.
     */
    this._errorParser = null;

    /**
     * The storage manager used to manage persistence of OAuth 2.0 tokens on client side.
     */
    this._storageManager = null;
    
    /**
     * The URL to the token endpoint used to retrieve an access and a refresh token.
     * 
     * @property {String}
     */
    this._tokenEndpoint = null;

    // Backup the global 'Backbone.ajax' method
    if(typeof Backbone !== 'undefined' && Backbone !== null) {
        
        // The existing 'Backbone.ajax' method must exist and being valid
        if(typeof Backbone.ajax !== 'function') {
            
            throw new Error('No valid \'Backbone.ajax\' method has been found !');
            
        }
        
        this._backupedBackboneDotAjax = Backbone.ajax;

    } 
    
    // If no global Backbone is available and no 'Backbone.ajax' method is provided this is an error
    else {
        
        throw new Error('Backbone is not available !');
        
    }

    // If a specific configuration is provided
    if(typeof configuration === 'object') {

        if(typeof configuration.errorParser !== 'undefined') {
            
            this._errorParser = configuration.errorParser;
            
        } else {
        
            this._errorParser = new ErrorParser();
        
        }

        this._storageManager = new StorageManager({
            storage : configuration.storage,
            storageKey : configuration.storageKey
        });
        
    } 
    
    // Otherwise the request manager uses a default configuration
    else {

        this._errorParser = new ErrorParser();
        this._storageManager = new StorageManager();
        
    }
};

BackboneRequestManager.prototype = {

    /**
     * Gets the storage manager linked to this request manager.
     * 
     * @returns {StorageManager} The storage manager linked to this request manager.
     */
    getStorageManager : function() {

        return this._storageManager;

    },
                                    
    /**
     * Starts the request manager.
     */
    start : function() {
        
        // Closure used to change the context of the overwritten Backbone.ajax function to that it can access the 
        // attributes and methods of this request manager
        var This = this;
        
        // Overwrites the 'Backbone.ajax' method 
        Backbone.ajax = function() { 
            
            return This._overwrittenBackboneDotAjax.apply(This, arguments);

        };

    },
    
    _jQueryAjaxPromiseFail : function(jqXHR, status, errorThrown) {
        
        // Parse the received error to know if its a known OAuth 2.0 error
        var action = this._errorParser.parse(jqXHR);
        
        // If the parse result is not 'undefined' then this is a known OAuth 2.0 error
        if(action !== undefined) {
            
            switch(action) {
                case 'refresh' :
                    this._refreshAccessToken();
                    break;
                case 'reniew' :
                    this._reniewAccessToken();
                    break;
                default:
                    throw new Error('Action \'' + action + '\' is invalid !');
            }

        }
        
    },
    
    /**
     * The overwritten 'Backbone.ajax' method.
     * 
     * @returns a JQuery promise.
     */
    _overwrittenBackboneDotAjax : function() {

        // Try to get an OAuth 2.0 Access Token from the client storage
        var accessToken = this._storageManager.getAccessToken();
    
        // Appends the 'access_token' URL parameter
        if(accessToken) {

            arguments[0].url += arguments[0].url.indexOf('?') === -1 ? '?' : '&';
            arguments[0].url += 'access_token';
            arguments[0].url += '=';
            arguments[0].url += accessToken;
    
        }
        
        var jQueryAjaxPromise = Backbone.$.ajax.apply(Backbone.$, arguments);
        jQueryAjaxPromise.fail(this._jQueryAjaxPromiseFail);

        return jQueryAjaxPromise;
    
    },
    
    /**
     * Function used to refresh the Access Token using the refresh token stored in the associated storage.
     */
    _refreshAccessToken : function() {

        // Try to get an OAuth 2.0 Refresh Token from the client storage
        var refreshToken = this._storageManager.getRefreshToken();
        
        // If a refresh token is stored on the client storage we try to refresh the access token using this refresh 
        // token
        if(refreshToken) {

            $.ajax(
                {
                    url : this._tokenEndpoint, 
                    data : { 'grant_type' : 'refresh_token', 'refresh_token' : refreshToken }, 
                    dataType : 'json',
                    type: 'POST',
                    error : $.proxy(this._reniewAccessToken, this), 
                    success : $.proxy(function(data, textStatus, jqXHR) {

                        // Store the refresed OAuth 2.0 in the local storage
                        // WARNING: Please not that besides the standard OAuth 2.0 Access Token informations the 
                        //          response also contain a 'user_id' field which is specific to the project and 
                        //          contains the technical identifier of the user on the platform
                    this._storageManager.persistRawAccessTokenResponse(JSON.stringify(data));

                    // Reloads the current view
                    // TODO: Très bizarre, il faudrait trouver un moyen de ré-exécuter la requête qui a échoué au début 
                    //       plutôt.
                    // reloadCurrentView();

                }, this)

            });

        }

        // Otherwise we try to reniew the access token
        else {

            this._reniewAccessToken();

        }

    }

};