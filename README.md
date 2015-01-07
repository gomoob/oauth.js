# OAuth.JS

[![Travis Build Status](http://img.shields.io/travis/gomoob/oauth.js.svg?style=flat)](https://travis-ci.org/gomoob/oauth.js)
[![Coverage Status](https://img.shields.io/coveralls/gomoob/oauth.js.svg?branch=master&style=flat)](https://coveralls.io/r/gomoob/oauth.js?branch=master)

OAuth.JS is a Javascript library used to easily request secured [OAuth 2.0](http://tools.ietf.org/html/rfc6749) Web 
Services.

OAuth.JS is specifically designed to work with RIA, SPA and HTML5 mobile applications, it provides the following 
features : 
 * Access and refresh token retrieval
 * Automatic and transparent Access and Refresh token reniewal
 * Automatic URL modifications to add an `access_token=xxxxxxxx` parameter in all your Web Service URLs
 * Access and refresh token storage on client side
 * Credentials storage on client side
 * JQuery, Backbone and Angular AJAX method overwritings to transparently request our secured OAuth 2.0 Web Services 
   using your favorite framework 

The following schema shows how the library works to automatically inject an `access_token` parameter in all URLs used to 
request your Web Services. 

On this schema we suppose we've initialized an OAuth.JS request manager. We want to get a protected list of users. 
As our server also acts as an OAuth 2.0 authorization server we have to provide a valid OAuth 2.0 Access Token to 
autorize our request. OAuth.JS allows you to request your Web Services as if they where not secured, under the cover the 
library will automatically add whats necessary to authorize you requests.

![Standard request](https://s3.amazonaws.com/gomoob-github/oauth.js/standard-request.png "Standard request")

## Installation

The easiest way to use the library is to pull it with [Bower](http://bower.io/) by adding the following dependency 
inside your `bower.json` file.

```json
{
    "devDependencies": {
        "oauth.js" : "~0.1",
    }
}
```

## Supported OAuth 2.0 authorization grants

OAuth.JS has been created to easily request your secured OAuth 2.0 Web Services inside RIA, SPA and mobile applications. 
In this context we often use the 
[Resource Owner Password Credentials Grant](http://tools.ietf.org/html/rfc6749#section-4.3) to get an OAuth 2.0 Access 
Token. 

So for now the [Resource Owner Password Credentials Grant](http://tools.ietf.org/html/rfc6749#section-4.3) is the only 
OAuth 2.0 [Authorization Grant](http://tools.ietf.org/html/rfc6749#section-1.3) supported in OAuth.JS. 

## Samples

Basic OAuth.JS use is very simple, simply create a request manager which supports the framework you use and starts it. 
Then each time you'll try to request your Web Services the library will do whats necessary to manage OAuth 2.0 secured 
authorizations and authentications.

Creating a request manager is done using the `OAuth.createRequestManager(framework, settings)` method, this method uses 2 
parameters : 
 * `framework` : The name of the framework you use, for now we only support Angular and Backbone
 * `settings`  : A settings object used to configure the request manager

After creating the request manager just call the `start()` method, this will overwrites the standard request management 
function associated to the your framework. For example with Angular this will overwrites the `$http` service, with 
Backbone it will overwrites the `Backbone.ajax` method.

### Working with Angular

```javascript
var requestManager = OAuth.createRequestManager(
    'angular',
    {
        credentialsGetter : new MyLoginPopup(),
        tokenEndpoint : 'https://myserver.com/token'
    }
);
requestManager.start();

// All calls to the Angular $http service will automatically manage OAuth 2.0 secured accesses under the cover

```

### Working with Backbone

```javascript
var requestManager = OAuth.createRequestManager(
    'backbone',
    {
        credentialsGetter : new MyLoginPopup(),
        tokenEndpoint : 'https://myserver.com/token'
    }
);
requestManager.start();

// All calls to Bakbone.ajax will automatically manage OAuth 2.0 secured accesses under the cover

```

### Credentials getter

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