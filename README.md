# OAuth.JS

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

```
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

invalid_client
 * client credentials are required
 * This client is invalid or must authenticate using a client secret
 * No client id supplied

invalid_request
 * JWT is malformed
 * Missing parameter: "code" is required
 * Missing parameters: "username" and "password" required
 * The grant type was not specified in the request
 * JWT is malformed
 * Missing parameters: "username" and "password" required
 * Missing parameter: "refresh_token" is required
 * Malformed auth header
 * The content type for POST requests must be "application/x-www-form-urlencoded"
 * Only one method may be used to authenticate at a time (Auth header, GET or POST)
 * The access token provided is invalid

invalid_grant
 * JWT failed signature verification
 * Authorization code doesn\'t exist or is invalid for the client
 * Invalid refresh token

invalid_nonce
 * This application requires you specify a nonce parameter