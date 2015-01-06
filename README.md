# OAuth.JS

[![Travis Build Status](http://img.shields.io/travis/gomoob/oauth.js.svg?style=flat)](https://travis-ci.org/gomoob/oauth.js)
[![Coverage Status](https://img.shields.io/coveralls/gomoob/oauth.js.svg?branch=master&style=flat)](https://coveralls.io/r/gomoob/oauth.js?branch=master)

OAuth.JS is a Javascript library used to easily request secured [OAuth 2.0](http://tools.ietf.org/html/rfc6749) Web 
Services.

OAuth.JS is specifically designed to work with RIA, SPA and HTML5 mobile applications, it provides the following 
features : 
 * Access and refresh token retrieval
 * Automatic and transparent access and refresh token reniewals
 * Transparent URL modifications to automatically request secured OAuth 2.0 Web Services
 * Access and refresh token storage on client side
 * Credentials storage on client side
 * JQuery, Backbone and Angular AJAX method overwritings to transparently request secured OAuth 2.0 Web Services
 * Mixed Facebook, Twitter, Google+ connect / OAuth 2.0 

The following grant types are supported : 
 * implicit
 * resource owner password credentials
 * client credentials

## Installation 

The easiest way to use the library is to pull it with [Bower](http://bower.io/) by adding the following dependency 
inside your `bower.json` file.

```json
{
    ...
    "devDependencies": {
        ...
        "oauth.js" : "~0.1",
        ...
    }
    ...
}
```

## Configuration

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