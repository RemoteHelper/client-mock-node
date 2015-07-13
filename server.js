var http = require('http');
var r = require('request');

var config = require('./config.json');


var doneUrl;
var userUrl;



http.createServer(function(request, response) {
    if (!isEvent(request)) return;

    r.post({
        url: doneUrl
    }, function(error, response, body) {
        if (error !== null) {
            throw error;
        }

        r.post({
            url: doneUrl,
            form: {
                authUrl: userUrl
            }
        }, function(error, response, body) {
            if (error !== null) {
                throw error;
            }
        });
    });
}).listen(config.port);


var isEvent = function(request) {
    return request.url === config.eventsUrl && request.method === 'POST';
};





var helperUrl = config.helper.host + config.helper.endpoint;
r.post({
    url: helperUrl,
    body: {
        media: {
            type: "url",
            content: config.sampleImageUrl
        },
        eventsURL: config.eventsUrl
    },
    json: true
}, function(error, response, body) {
    if (error !== null) {
        throw error;
    }

    doneUrl = body.doneUrl;
    userUrl = body.userUrl;
});
