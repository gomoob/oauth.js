[![Travis Build Status](http://img.shields.io/travis/gomoob/oauth.js.svg?style=flat)](https://travis-ci.org/gomoob/oauth.js)
[![Coverage Status](https://img.shields.io/coveralls/gomoob/oauth.js.svg?branch=master&style=flat)](https://coveralls.io/r/gomoob/oauth.js?branch=master)

OAuth.JS is a Javascript library used to easily request secured [OAuth 2.0](http://tools.ietf.org/html/rfc6749) Web 
Services. 

The design of the library is largely inspired by the Facebook Javascript SDK and provides you similar methods, but the 
difference is that the called Web Services are not Facebook one's but your own Web Services. 

OAuth.JS is specifically designed to work with RIA, SPA and HTML5 web / mobile applications, it provides the following 
features : 
 * Access and refresh token retrieval
 * Automatic and transparent Access and Refresh token reniewal
 * Automatic URL modifications to add an `access_token=xxxxxxxx` parameter in all your Web Service URLs
 * Access and refresh token storage on client side
 * Credentials storage on client side
 * JQuery, Backbone and Angular AJAX method overwritings to transparently request your secured OAuth 2.0 Web Services 
   using your favorite framework 

# Installation

The easiest way to use the library is to pull it with [Bower](http://bower.io/) by adding the following dependency 
inside your `bower.json` file.

```json
{
    "devDependencies": {
        "oauth.js" : "~0.1",
    }
}
```

# Usage

Using OAuth.JS is very easy and is done in 2 steps : 
 * First initialize the OAuth.JS client using the `OAuth.init(opts)` method (the name `init` has been chosen to be 
   similar to Facebook's `FB.init(opts)` method). 
 * Call your secured Web Services using the `secured` additional parameter.

Detailed configuration and usage is described in the following sub sections.

## Initialize the OAuth.JS client

When your application starts initialize the OAuth.JS client using the following peace of code. 

```javascript
OAuth.init(
    {
        clientId : 'my-app'
        tokenEndpoint : 'https://myserver.com/token',
        loginFn : function(loginContext) { ... 
            // Open a login view and resolve the promise with the provided credentials
            // Then OAuth.JS will do what's necessary to get an OAuth 2.0 Access Token automatically
        },
        parseErrorFn : function(xMLHttpRequest) {
            // Parse errors returned from server side to know if they must imply OAuth 2.0 Access Token reniewal or 
            // refresh
        }
    }
);
```

The OAuth.JS `init` options are described in the following sub-sections.

### `clientId` (required)

The OAuth 2.0 Client Credentials `client_id` parameter to be sent by the OAuth.JS client to get new Access Tokens.

### `tokenEndpoint` (required)

The absolute URL to your OAuth 2.0 token endpoint.

### `loginFn` (required)

The `loginFn` function is used to display a login dialog or page to the user. We could compare this login modal dialog 
to the Facebook Javascript SDK Login Modal Dialog. But with OAuth.JS you create your own Login Modal Dialog, then the 
library will automatically call it when its necessary.

The `loginFn` function will be called each time the OAuth.JS client detects it cannot use a valid OAuth 2.0 Access Token
.

This could appear in the following situations :
 * Your server returned an error and the parsing of this error indicates that the OAuth 2.0 Access Token received is 
   invalid.
 * The OAuth.JS client cannot use or find a valid cached OAuth 2.0 Access Token.

The `loginFn(credentialsPromise)` function takes only 1 parameter which we call a credentials promise. This credentials 
promise must be called / resolved when your user provides its credentials in your Login Modal Box.

#### The `LoginContext` object

The `LoginContext` object is an object you have to keep while OAuth.JS did not return a successful login response.
This object has only one method `sendCredentials`.

The `sendCredentials` method is used to send credentials entered by your users to your OAuth 2.0 server, this method can 
be called with the following parameters : 
 * `credentials` : An object which describes the user credentials to send on server side.
 * `cb` : A callback function called by the OAuth.JS client after credentials have been provided and sent to the server 
          and a response has been received.
 * `opts` : Additional options used to configure the login behavior.

Here is a sample function (we suppose our application provides a simple Login Modal) : 
```javascript
function(loginContext) {
    
    // Show our custom Login Modal dialog and pass it the OAuth.JS Credentials Promise object
    showLoginModal(new LoginModal({ loginContext : loginContext }));

}
```

Our Login Modal could contain the following code.
```javascript
{
    initialize : function(options) {
        this._loginContext = options.loginContext;
    },

    _onLoginButtonClick : function(clickEvent) {
    
        // Change the style of our form while OAuth.JS is trying to get an OAuth 2.0 Access Token
        this.disableForm();
        this.showWaitingIndicator();
        
        // We transmit the credentials to OAuth.JS to let it get a new OAuth 2.0 Access Token with those credentials
        this._loginContext.sendCredentials(
            {
                // Indicates to OAuth.JS which OAuth 2.0 grant type to use to get an OAuth 2.0 Access Token
                'grand_type' : 'password',
                username : $('#username').val(),
                password : $('#password').val()
            },
            $.proxy(this._afterLogin, this)
        );

    }, 
    
    _afterLogin : function(response) {
        
        if(response.status === 'connected') {
        
            // Force the view displayed before the Login Modal Box to be refreshed
            window.location.hash = window.location.hash + '?random=' + Math.random();
        
        } else {
        
           this.showError('Login failed !');
        
        }

    }
}
```

### `parseErrorFn` (required)

Callback function called by the OAuth.JS client when an error is returned from your Web Services. The purpose of this 
function is to decode the error payload received and indicate to the OAuth.JS client if the error received should 
trigger an OAuth 2.0 token refresh or reniewal.

### `storageManager` (optional) 

When OAuth.js successfully retrives an OAuth 2.0 Access Token it has to store it somewhen in a client side memory or 
database to reuse it and authorize requests. 

For this purpose a storage manager object is used, the library is provided with an HTML 5 storage manager which is 
implemented in the `OAuth.Storage.WebStorage` class. This is the default storage manager used if no specific storage 
manager is configured, in this case the HTML 5 local storage is used with a key equal to `oauth.js`. 

You can configure the `OAuth.Storage.WebStorage` used if you want, here is a sample.

```javascript
OAuth.init(
    {
        ...
        storageManager : new OAuth.Storage.WebStorage(
            {
                storage : sessionStorage,
                storageKey : 'myapp'
            }
        )
    }
);
```

### `transformDataFn` (optional)

When OAuth.js send a request to your configured token endpoint it sends several query / URL parameters (internally those
parameters are transmitted to the `XmlHttpRequest.send(data)` method). 

For example if your token endpoint is equal to `https://myserver.com/token` at login the following data could be 
provided by OAuth.js. 

```javascript
{
    grant_type : 'password',
    client_id : 'my-app',
    username : 'john',
    password : 'doe'
}
```

In rare cases you would like to ask OAuth.js to send additional data when it executes Ajax requests. For example if you 
are working on a mobile application it could be useful to track when your users connect to your application and with 
which devices. 

In this case it would be useful to send the following data instead. 

```javascript
{
    grant_type : 'password',
    client_id : 'my-app',
    username : 'john',
    password : 'doe',
    os : 'Android', 
    deviceUuid : 'xxxxxxxx'
}
```

The `transformDataFn(data)` allows you to do exactly that, it receives the original `data` object OAuth.js would 
normally and return an updated data object to be used instead.

``` 
tranformDataFn : function(data) {
    
    return OAuth.ObjectUtils.extend(
        data, 
        {
            os : MyApp.DeviceManager.getOs(),
            deviceUuid : MyApp.DeviceManager.getUuid()
        }
    );
    
}
```

## Login your user

The first time you application starts and your OAuth.JS client is configured nothing has been done on client side to 
indicate to OAuth.JS how to request your secured Web Services. 

To work correctly OAuth.JS must have an OAuth 2.0 Access Token available, to retrieve a first OAuth 2.0 Access Token you 
have to ask your users to login into your app. After a first successful login an OAuth 2.0 Access Token is retrieved and 
cached on client side, this cached OAuth 2.0 Access Token is then transparently used by OAuth.JS to keep a secured 
connection opened between your app and your server (automatic Access Token refresh). 

OAuth.JS provides an `OAuth.login(cb)` function to check if a valid OAuth 2.0 Access Token is available. The 
`OAuth.login(cb)` function is very similar to the Facebook Javascript SDK `FB.login(cb)` function, but instead 
of opening a Facebook login modal box OAuth.JS will open your own login modal or view. 

If the `OAuth.login(cb)` function detects that no OAuth 2.0 Access Token is available or the one available is invalid 
then it will automatically call your `loginFn` callback function. If OAuth.JS detects that a valid OAuth 2.0 Access 
Token is available it calls the login callback (i.e `cb` parameter of the `login` method) directly without requesting 
your server.

Here is a sample.

```javascript
OAuth.login(
    function(authStatus) {

        // Here we can be sure OAuth.JS has a valid OAuth 2.0 Access Token, so we can requet a secured Web Service
        // In general each time you have to display a view which requires data from a secured Web Service you have to 
        // wrap you view opening code inside the login function
        Backbone.Radio.channel('app-view').command('show-center-view', new MyAccountView());

    }
);
```

## Call your secured Web Services

If your OAuth.JS client is correctly initialized the 
[`XMLHttpRequest`](https://developer.mozilla.org/fr/docs/Web/API/XMLHttpRequest "XMLHttpRequest") object in use in your 
application has been overwritten to manage OAuth 2.0 transparently.

When you request your server you have now 2 choices : 
 * You want to request a publicly available resource, in this case OAuth.JS do not have to do anything and the request 
   should work normally.
 * You want to request a Web Service secured using OAuth 2.0, in this case you have to provided a special `secured` 
   parameter to your AJAX request function. 

The following sub sections shows several request scenarios using multiple frameworks.

### Plain Javascript

```javascript
// Public request
var req = new XMLHttpRequest();
req.open('GET', 'https://myserver.com/rest/user_accounts/10', true);
req.onreadystatechange = function (event) { ... }
req.send(null);

// Secured request
var req = new XMLHttpRequest();
req.openSecured('GET', 'https://myserver.com/rest/user_accounts/10', true);
req.onreadystatechange = function (event) { ... }
req.send(null);
```

### JQuery

```javascript
// Public request
$.ajax(
    {
        url : 'https://myserver.com/rest/user_accounts/10',
        success : function(data, textStatus, jqXHR) { ... },
        error : function(jqXHR, textStatus, errorThrown) { ... }
    }
);

// Secured request (add a special 'secured' parameter)
$.ajax(
    {
        url : 'https://myserver.com/rest/user_accounts/10',
        success : function(data, textStatus, jqXHR) { ... },
        error : function(jqXHR, textStatus, errorThrown) { ... },
        secured : true
    }
);
```

### Backbone.JS

```javascript
// Public request
new User({id : 10}).fetch(
    {
        success : function(model, response, options) { ... },
        error : function(model, response, options) { ... }
    }
);

// Secured request (add the special 'secured' parameter)
new User({id : 10, secured : true}).fetch(
    {
        success : function(model, response, options) { ... },
        error : function(model, response, options) { ... },
        secured : true
    }
);
```

### Angular.JS

```javascript
// Public request
$http.get('https://myserver.com/rest/user_accounts/10').
    success(function(data, status, headers, config) { ... }).
    error(function(data, status, headers, config) { ... });
    
// Secured request (add a special 'secured' parameter)
$http.get('https://myserver.com/rest/user_accounts/10', { secured : true }).
    success(function(data, status, headers, config) { ... }).
    error(function(data, status, headers, config) { ... });
```

# How does it work ?

The following schema shows how the library works to automatically inject an `access_token` parameter in all URLs used to 
request your Web Services. 

On this schema we suppose we've initialized an OAuth.JS request manager. We want to get a protected list of users. 
As our server also acts as an OAuth 2.0 authorization server we have to provide a valid OAuth 2.0 Access Token to 
autorize our request. OAuth.JS allows you to request your Web Services as if they where not secured, under the cover the 
library will automatically add whats necessary to authorize you requests.

![Standard request](https://s3.amazonaws.com/gomoob-github/oauth.js/standard-request.png "Standard request")


#### Resource Owner Password Credentials

```javascript
{
    getCredentials : function(credentialsPromise) {
        
        // Open a popup and ask for user credentials...
        
        // Resolving the credentials promise will instruct OAuth.js to get a new OAuth 2.0 Access Token using the 
        // configured token end point
        credentialsPromise.resolve(
            {
                grant_type : 'password',
                username : 'john',
                password : 'doe'
            }
        );

    }
}
```

#### Facebook Auth Response Credentials

```javascript
{
    getCredentials : function(credentialsPromise) {
    
        // Open a popup and login the use with Facebook, the retrieve the Facebook Auth response
        
        // Resolving the credentials promise will instruct OAuth.js to get a new OAuth 2.0 Access Token using the 
        // configured token end point
        credentialsPromise.resolve(
            {
                grant_type : 'oauthjs_facebook',
                facebookAuthResponse : facebookAuthResponse
            }
        );
    
    }
}
```

# Reference

This section document the main functions and objects used in the OAuth.js library.

## Namespaces

The OAuth.js library defines several "namespaces" used to organize its source code and clearly identify responsibilities
, here are the namespaces available : 

 * The `OAuth.AccessToken` namespace contains classes used to manipulate and parse OAuth 2.0 access tokens (this also 
   include refresh tokens) ; 
 * The `OAuth.Model` namespace define classes used by the OAuth.js library ;
 * The `OAuth.Request` namespace contains classes used to manage OAuth 2.0 requests ; 
 * The `OAuth.Storage` namespace contains classes used to manage storage of OAuth 2.0 access tokens and more generally 
   connection states on client side ; 
 * The `OAuth.Utils` namespace contains several utility classes which are not strictly related to OAuth 2.0.

## Namespace `OAuth.AccessToken`

## Namespace `OAuth.Model`

### Class `OAuth.Model.AuthStatus`

The `OAuth.Model.AuthStatus` class is used to represent the full user authentication state on client side. 

#### Method `OAuth.Model.AuthStatus.getAccessTokenResponse()`

#### Method `OAuth.Model.AuthStatus.isConnected()`

Method used to check if the current user is **considered** to be connected. 

```javascript
    // The user is considered connected
    if(authStatus.isConnected()) {

        console.log('Welcome John Doe !');

    } 

    // The user is considered disconnected
    else {

        console.log('Oups it seems your not connected, please login first to view this page.');

    }
```

**WARNING** : At any time a user can be *considered* connected on client side but being disconnected in fact (i.e its 
OAuth 2.0 Access Token is invalid or expired). The `AuthStatus` is generally retrieved from a client side storage and 
transport informations about the last successfully retrieved OAuth 2.0 Access Token. In the meantime this OAuth 2.0 
Access Token could have been expired or invalidated.

#### Method `OAuth.Model.AuthStatus.isDisconnected()`

Method used to check if the current user is **considered** to be disconnected. 

```javascript
    // The user is considered disconnected
    if(authStatus.isDisconnected()) {

        console.log('Oups it seems your not connected, please login first to view this page.');

    } 

    // The user is considered connected
    else {

        console.log('Welcome John Doe !');

    }
```

**WARNING** : At any time a user can be *considered* connected on client side but being disconnected in fact (i.e its 
OAuth 2.0 Access Token is invalid or expired). The `AuthStatus` is generally retrieved from a client side storage and 
transport informations about the last successfully retrieved OAuth 2.0 Access Token. In the meantime this OAuth 2.0 
Access Token could have been expired or invalidated.

#### Method `OAuth.Model.AuthStatus.toJSON()`

#### Method `OAuth.Model.AuthStatus.toString()`

### Class `OAuth.Model.LoginContext`

The `OAuth.Model.LoginContext` object transports informations used to login a user on an OAuth 2.0 server. In Auth.js 
what we call a "login" is an HTTP POST requests to an OAuth 2.0 token endpoint. 

In your application when you configure the OAuth.js library your define a `loginFn(loginContext)` function which is 
automatically called when the library detects a new login is required.

The received `OAuth.Model.LoginContext` object can then be used to transmit credentials to OAuth.js which will then 
automatically execute an HTTP POST request to your configured OAuth 2.0 token endpoint. 

```javascript
OAuth.init(
    {
        ...
        loginFn : function(loginContext) {
        
            ...
            
            // Asks OAuth.js to login our user
            loginContext.sendCredentials(
                {
                    grant_type : 'password',
                    username : 'jdoe',
                    password : 'xxxxxxxx'                
                },
                function(authStatus) {
                
                    // Check the AuthStatus object to see if login was successful
                
                }
            );

        }
        ...
    }
);
```

#### Method `OAuth.Model.LoginContext.sendCredentials(credentials, loginFnCb, loginFnOpts)`



### Class `OAuth.Model.RequestContext`

## Namespace `OAuth.Request`

## Namespace `OAuth.Storage`

### Class `OAuth.Storage.WebStorage`

## Namespace `OAuth.Utils` 

### Class `OAuth.Utils.ABNFUtils`

### Class `OAuth.Utils.FunctionUtils`

### Class `OAuth.Utils.ObjectUtils`

### Class `OAuth.Utils.UrlUtils`

### Class `OAuth.Utils.XhrUtils`

# FAQ

## What's the difference between a token refresh and reniewal ?

## What are the OAuth 2.0 authorization grants supported ?

OAuth.JS has been created to easily request your secured OAuth 2.0 Web Services inside RIA, SPA and mobile applications. 
In this context we often use the 
[Resource Owner Password Credentials Grant](http://tools.ietf.org/html/rfc6749#section-4.3) to get an OAuth 2.0 Access 
Token. 

So for now the [Resource Owner Password Credentials Grant](http://tools.ietf.org/html/rfc6749#section-4.3) is the only 
OAuth 2.0 [Authorization Grant](http://tools.ietf.org/html/rfc6749#section-1.3) supported in OAuth.JS. 

## My browser always complains about a "Access-Control-Allow-Origin" header, why ?

# Release history

## 0.2.0 (2015-11-XX)
 * **BREAKING CHANGE** Now the Backbone request manager use `AuthStatus` objects the same was as the Angular request 
   manager. It implies that the structure of the object stored on the storage changes and is more detailed. Also it 
   means that now with Backbone the `OAuth.login(...)` method receives an `AuthStatus` object instead of a "raw" JSON 
   response object ;
 * **BREAKING CHANGE** Remove the `storage` configuration option and prefer the new `storageManager` option instead ; 
 * **BREAKING CHANGE** Remove the `storageKey` configuration option, now users have to explicitly instanciate an 
   `OAuth.Storage.WebStorage` storage manager if they want to configure a specific storage key ; 
 * Add a new `storageManager` option which will allow a developer to develop new storage manager (which could have 
   different APIs different from standard HTML 5 storages) ; 
 * Implement a request Manager for Angular JS ; 
 * Add a new `transformDataFn(data)` option function which can be used to modify the data sent by the library ;
 * Add a new `storage` option object which allow to specify a custom storage to the library.

## 0.1.1 (2015-03-10)
 * Fix bower.json package name.

## 0.1.0 (2015-03-10)
 * First release, not perfect but working as expected in one of our Backbone.Marionette Mobile Application ;
 * This release will allow to make appear the library in the Bower registry.

