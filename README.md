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
 * First initialize the OAuth.JS client using the `OAuth.init(opts)` method (the name `init` has been choosen to be 
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
        loginFn : function(credentialsPromise) { ... 
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

The OAuth.JS client requires 4 parameters described in the following sub-sections.

### `clientId`

The OAuth 2.0 Client Credentials `client_id` parameter to be sent by the OAuth.JS client to get new Access Tokens.

### `tokenEndpoint`

The absolute URL to your OAuth 2.0 token endpoint.

### `loginFn`

The `loginFn` function is used to display a login dialog or page to the user. We could compare this login modal dialog 
to the Facebook Javascript SDK Login Modal Dialog. But with OAuth.JS you create your own Login Modal Dialog, then the 
library will automatically call it when its necessary.

The `loginFn` function will be called each time the OAuth.JS client detects it cannot use a valid OAuth 2.0 Access Token
. 

This could appear in the following situations :
 * Your server returned an error and the parsing or this error indicates that the OAuth 2.0 Access Token received is 
   invalid.
 * The OAuth.JS client cannot use or find a valid cached OAuth 2.0 Access Token.

The `loginFn(credentialsPromise)` function only 1 parameter which we call a credentials promise. This credentials 
promise must be resolved when your user provides its credentials in your Login Modal Box.

When you resolve a promise you can provide 3 different parameters : 
 * `credentials` : An object which describes the user credentials.
 * `cb` : A callback function called by the OAuth.JS client after credentials have been provided and sent to the server 
          an a response has been received.
 * `opts` : Additional options used to configure the login behavior.

Here is a sample function (we suppose our application provides a simple Login Modal) : 
```javascript
function(cb) {

    showLoginModal(new LoginModal({ sendCredentials : cb }));

}
```

Our Login Modal could contain the following code.
```javascript
{
    initialize : function(options) {
        this._sendCredentials = options.sendCredentials;
    },

    _onLoginButtonClick : function(clickEvent) {
    
        // Change the style of our form while OAuth.JS is trying to get an OAuth 2.0 Access Token
        this.disableForm();
        this.showWaitingIndicator();
        
        // We transmit the credentials to OAuth.JS to let it get a new OAuth 2.0 Access Token with those credentials
        this._sendCredentials(
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

### `parseErrorFn`

Callback function called by the OAuth.JS client when an error is returned from your Web Services. The purpose of this 
function is to decode the error payload received and indicate to the OAuth.JS client if the error received should 
trigger an OAuth 2.0 token refresh or reniewal.

## Login your user

The first time you application starts and your OAuth.JS client is configured nothing has been done on client side to 
indicate to OAuth.JS how to request your secured Web Services. 

To work correctly OAuth.JS must have an OAuth 2.0 Access Token available, to retrieve a first OAuth 2.0 Access Token you 
have to ask your users to login into your app. After a first successful login an OAuth 2.0 Access Token is retrieved and 
cached on client side, this cached OAuth 2.0 Access Token is then transparently used by OAuth.JS to keep a secured 
connection opened between your app and your server (automatic Access Token refresh). 

OAuth.JS provided the `OAuth.login(cb)` function to check if it has a valid OAuth 2.0 Access Token (please note thate 
the `OAuth.login(cb)` function is very similar to the Facebook Javascript SDK `FB.login(cb)` function, but instead of 
opening a Facebook login modal box OAuth.JS will open your own login modal or view). If the `OAuth.login(cb)` function 
detects that no OAuth 2.0 Access Token is available or the one available is invalid then it will automatically open your 
`loginFn` callback function. If OAuth.JS detects that a valid OAuth 2.0 Access Token is available it calls the login 
callback directly without requesting your server.

Here is a sample.

```javascript
OAuth.login(function(response) {
    
    // Here we can be sure OAuth.JS has a valid OAuth 2.0 Access Token, so we can requet a secured Web Service
    // In general each time you plan to display a view which requires data get from a secured Web Service you have to 
    // wrap you view opening code inside the login function
    Backbone.Radio.channel('app-view').command('show-center-view', new MyAccountView());

});
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


