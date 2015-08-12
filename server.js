"use strict";

var path = require('path');
var url  = require('url');
var http = require('http');

var r             = require('request');
var parseJSONBody = require('body/json');
var Router        = require('node-simple-router');

var config = require('./config.json');


var doneURL;
var userURL;


var useCasesHandlers = {
    limitedNumberOfEvents: function() {
        var MAX_NUMBER_OF_EVENTS_ALLOWED = 10;
        var totalNumberOfEvents = 0;


        return function handler(request, response) {
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
        };
    },
    recaptcha: function() {
        var tile = require('./recaptcha/tile');

        var handler = Router({
            static_route: path.join(__dirname, config.gridImagesDirectory)
        });

        handler.post(config.eventsEndpoint, function(request, response) {
            var event = request.body;
            console.log('received event:', event);

            if (event.type !== 'mousedown') {
                response.end();
                return;
            }

            tile.click(event.content.coordinates);

            sendUpdatedRecaptchaImage(tile.toImageIdentifier(), response);
        });

        return handler;
    }
};






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

var sendUpdatedRecaptchaImage = function(imageIdentifier, response) {
    response.writeHead(200, { 'Content-Type': 'application/json'} )

    var partsOfURLToImage = partsOfURLToSelf;
    partsOfURLToImage.pathname = 'grid' + imageIdentifier + '.png';

    response.end(JSON.stringify({
        mediaURL: url.format(partsOfURLToImage)
    }));
};







http.createServer(
    useCasesHandlers.recaptcha()
).listen(config.self.port);




// Make initial help request to the server
var helperURL = url.format(config.helper);

var partsOfURLToSelf = config.self;

var partsOfEventsURL = Object.create(partsOfURLToSelf);
partsOfEventsURL.pathname = config.eventsEndpoint;
var eventsURL = url.format(partsOfEventsURL);

var partsOfImageGridURL = Object.create(partsOfURLToSelf);
partsOfImageGridURL.pathname = 'grid0.png';
var imageGridURL = url.format(partsOfImageGridURL);

var sampleImageURL = config.sampleImageURL;




var makeHelpRequest = function(givenMediaURL) {
    r.post({
        url: helperURL,
        body: {
            mediaURL: givenMediaURL,
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
};


makeHelpRequest(imageGridURL);
