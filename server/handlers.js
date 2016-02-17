var fs = require('fs');
var autocomplete = require('./autocomplete.js');
var madlibber = require('./madlibber.js');
var wordnik = require('./wordnik.js');

function parseQueryParams(url) {
    console.log(url);
    var queryString = url.split('?')[1];
    var rawParams = queryString.split('&');
    return rawParams.reduce(function(prev, curr) {
        var keyval = curr.split('=');
        prev[keyval[0]] = keyval[1];
        return prev;
    }, {});
}

function homeHandler(request, response) {
    response.writeHead(200, {'Content-Type': 'text/html'});
    fs.readFile(__dirname + '/../index.html', function(error, index) {
        if (error) {
            console.log(error);
            response.end();
        } else {
            response.write(index);
            response.end();
        }
    });
}

function startHandler(request, response) {
    var wordData = madlibber.reset();
    response.writeHead(200, {'Content-Type': 'application/json'});
    response.end(JSON.stringify({
        "complete": false,
        "nextHint": wordData.hint,
        "partOfSpeech": wordData.partOfSpeech,
        "data": "",
    }));
}

function autocompleteHandler(request, response) {
    queryParams = parseQueryParams(request.url);
    var randomise = (queryParams.randomise == 'true') ? true : false;
    var num = (queryParams.number) ? parseInt(queryParams.number, 10) : 10;
    var dict = autocomplete.getDict(queryParams.type);
    var matches = dict.findMatches(queryParams.fragment, num, randomise);
    response.writeHead(200, {'Content-Type': 'application/json'});
    var matchObject = {
        "suggestions": matches
    };
    response.end(JSON.stringify(matchObject));
}

function submitHandler(request, response) {
    queryParams = parseQueryParams(request.url);

    if (queryParams.word && queryParams.word.length >= 1) {
        var errorCallback = function(){
            //Unsure of status code number!!!!!!!!!!!!!!!!!!!!!!!!
            response.writeHead(502, {'Content-Type': 'application/json'});
            response.end(JSON.stringify({
                "error": queryParams.word + " not recognised"
            }));
        };
        var successCallback = function(){
            var responseObject = madlibber.fillBlank(queryParams.word);
            response.writeHead(200, {'Content-Type': 'application/json'});
            response.end(JSON.stringify(responseObject));
        };
        wordnik.checkWord(queryParams.word, errorCallback, successCallback);
    } else {
        response.writeHead(400, {'Content-Type': 'application/json'});
        response.end(JSON.stringify({
            "error": "Input field left blank"
        }));
    }
}

function notFoundHandler(request, response) {
    response.writeHead(404, {'Content-Type': 'text/html'});
    response.end('<img src="http://www.travelnlass.com/wp-content/uploads/2015/07/Standard404Page.jpg"/>');
}

function resourceHandler(request, response) {
    fs.readFile(__dirname + '/../' + request.url, function(error, content) {
        if (error) {
            console.log(error);
            response.writeHead(204, {'Content-Type': 'text/html'});
            response.end();
        } else {
            var ext = request.url.split('.')[1];
            var contentType = 'text/';
            ext = (ext == 'js') ? 'javascript' : ext;
            contentType = (ext == 'png') ? 'image/' : 'text/';
            response.writeHead(200, {'Content-Type': contentType + ext});
            response.end(content);
        }
    });
}

module.exports = {
    homeHandler: homeHandler,
    startHandler: startHandler,
    autocompleteHandler: autocompleteHandler,
    submitHandler: submitHandler,
    notFoundHandler: notFoundHandler,
    resourceHandler: resourceHandler,
};
