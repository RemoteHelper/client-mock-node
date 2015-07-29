var http = require('http');
var r = require('request');

var config = require('./config.json');


var doneURL;
var userURL;



http.createServer(function(request, response) {
    if (!isEvent(request)) return;

    console.log('received event!');

    // Tell the server that we are done
    r.post({
        url: doneURL,
        body: {
            authURL: userURL
        },
        json: true
    }, function(error, response, body) {
        if (error !== null) {
            throw error;
        }

        console.log('help job stopped');
    });

    response.end();
}).listen(config.port);


var isEvent = function(request) {
    return request.url === config.eventsEndpoint && request.method === 'POST';
};




// Make help request to the server
var helperURL = config.helper.host + config.helper.endpoint;
var eventsURL = config.host + ':' + config.port + config.eventsEndpoint;
r.post({
    url: helperURL,
    body: {
        mediaURL: config.sampleImageURL,
        eventsURL: eventsURL
    },
    json: true
}, function(error, response, body) {
    if (error !== null) {
        throw error;
    }

    doneURL = body.doneURL
    userURL = body.userURL;

    console.log('given doneURL', doneURL);
    console.log('given static page:', userURL);
});
