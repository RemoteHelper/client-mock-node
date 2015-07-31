"use strict";

var http = require('http');

var r             = require('request');
var parseJSONBody = require('body/json');

var config = require('./config.json');



var doneURL;
var userURL;

var MAX_NUMBER_OF_EVENTS_ALLOWED = 10;
var totalNumberOfEvents = 0;

http.createServer(function(request, response) {
    if (!isEvent(request)) return;

    console.log('received event!');

    totalNumberOfEvents++;

    if (totalNumberOfEvents >= MAX_NUMBER_OF_EVENTS_ALLOWED) {
        response.end(function() {
            endHelpJob();
        });
        return;
    }

    parseJSONBody(request, function(error, body) {
        if (error !== null) {
            throw error;
        }

        var event = body;
        console.log(event);
        if (event.type === 'mouseup' && event.content.coordinates.x > event.content.coordinates.y) {
            sendNewMediaURL(response);
        } else {
            response.end();
        }
    });
}).listen(config.port);


var isEvent = function(request) {
    return request.url === config.eventsEndpoint && request.method === 'POST';
};

var sendNewMediaURL = function(response) {
    response.writeHead(200, { 'Content-Type': 'application/json'} )
    response.end(JSON.stringify({
        mediaURL: config.sampleImageURL
    }));
};

var endHelpJob = function() {
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
};




// Make initial help request to the server
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
