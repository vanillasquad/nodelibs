var fs = require('fs');
var autocomplete = require('./autocomplete.js');
var madlibber = require('./madlibber.js');
var wordnik = require('./wordnik.js');
var colors = require('colors');

function homeHandler(request, response) {
    madlibber.reset();
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
    var required = madlibber.reset();
    response.writeHead(200, {'Content-Type': 'application/json'});
    response.end(JSON.stringify({"partOfSpeech": required[0]}));
}

function autocompleteHandler(request, response) {
    var queryString = request.url.split('?')[1];
    var rawParams = queryString.split('&');
    var queryParams = rawParams.reduce(function(prev, curr) {
        var keyval = curr.split('=');
        prev[keyval[0]] = keyval[1];
        return prev;
    }, {});
    var randomise = (queryParams.randomise == 'true') ? true : false;
    var dict = autocomplete.getDict(queryParams.type);
    var matches = dict.findMatches(queryParams.fragment, 10, randomise);
    response.writeHead(200, {'Content-Type': 'application/json'});
    var matchObject = {
        "suggestions": matches
    };
    response.end(JSON.stringify(matchObject));
}

function submitHandler(request, response) {
    console.log('________AT BEGINNING OF SUBMIT___________');
    console.log('userBlanks is: ' + madlibber.userBlanks);
    console.log('Required words are: ' + madlibber.currentMadLib);
    var word = request.url.match(/:([\w]*)/i)[1]; //matches the submitted word

    var errorCallback = function(){
        //Unsure of status code number!!!!!!!!!!!!!!!!!!!!!!!!
        response.writeHead(200, {'Content-Type': 'text/html'});
        response.end('wordnik error');
    };
    var successCallback = function(partOfSpeech){
        var responseObj = madlibber.fillBlank(word, partOfSpeech);
        response.end(blank);
    };

    wordnik.checkWord(word, errorCallback, successCallback);
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
            ext = (ext == 'js') ? 'javascript' : ext;
            response.writeHead(200, {'Content-Type': 'text/' + ext});
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
