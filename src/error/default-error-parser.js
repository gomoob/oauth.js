OAuth.Error.DefaultErrorParser = function() {};

OAuth.Error.DefaultErrorParser.prototype = {

    parse : function(xMLHttpRequest) {

        // If we are on a 401 HTTP error response (i.e Unauthorized)
        if(xMLHttpRequest.status === 401) {
            
            switch(xMLHttpRequest.responseText) {    
                case 'token_expired':
                    return 'refresh';
                case 'token_invalid':
                    return 'reniew';
            }

        }

    }

};