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
    form: {
        media: config.sampleImageUrl,
        eventsUrl: config.eventsUrl
    }
}, function(error, response, body) {
    if (error !== null) {
        throw error;
    }

    var bodyInJson = JSON.parse(body);
    doneUrl = bodyInJson.doneUrl;
    userUrl = bodyInJson.userUrl;
});
