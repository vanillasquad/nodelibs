var tape = require('tape');
var server = require('../server/server.js');
var colors = require('colors');


tape('server.js has function .init()',function(t){
    t.equal(typeof server.init, 'function', 'server.init is a function');
    t.end();
});

var tape = require('tape');
var hyperquest = require('hyperquest');
var concat = require('concat-stream');
var app = require('../server/app.js');
var fs = require('fs');
var madlibber = require('../server/madlibber.js');

tape('server returns 200 on homepage', function(t) {
    hyperquest.get('http://localhost:8000/', function(error, response) {
        t.equal(response.statusCode, 200, 'assert status code is 200');
        t.end();
    });
});

tape('request to homepage returns HTML', function(t) {
    hyperquest.get('http://localhost:8000/', function(error, response) {
        response.pipe(concat(function(payload) {
            t.ok(payload.toString('utf8').match('<!DOCTYPE html>'), 'check for DOCTYPE');
            t.ok(payload.toString('utf8').match('<html>'), 'check for HTML tag');
            t.end();
        }));
    });
});

tape('request returns style.css', function(t) {
    t.plan(3);
    ['/index.html', '/index.js', '/style.css'].forEach(function(item) {
        hyperquest.get('http://localhost:8000' + item, function(error, response) {
            response.pipe(concat(function(payload) {
                fs.readFile(__dirname + '/..' + item, function(error, content) {
                    t.equal(content.toString('utf8'), payload.toString('utf8'), 'Check for '+ item +' content');
                });
            }));
        });
    });
});

tape('test 404 handler', function(t) {
    var invalidURL = '/cat';
    hyperquest.get('http://localhost:8000' + invalidURL, function(error, response) {
        response.pipe(concat(function(payload) {
            t.ok(payload.toString('utf8').match('404'), 'assert that 404 responses contain 404 in the body');
            t.end();
        }));
    });
});


tape('submitWord endpoint calls madlibber file and returns string', function(t){
    var submitWord = 'submit-word:table';
    madlibber.reset(); //sets up madlibber
    hyperquest.get('http://localhost:8000/' + submitWord, function(error, response){
        response.pipe(concat(function(payload){
            t.equal(payload.toString('utf8'), '', 'Client call to submit word, and user hasnt finished, should return empty string');
            t.end();
        }));
    });
});

tape('submitWord endpoint when total words are submitted returns a full sentence', function(t){
    var submitWord = 'submit-word:going';
    // madlibber.reset();
    madlibber.userBlanksSetter(madlibber.testUserBlanksAlmostFull);
    madlibber.currentMadLibSetter(madlibber.testMadlibObj);
    hyperquest.get('http://localhost:8000/' + submitWord, function(error, response){
        response.pipe(concat(function(payload){
            t.equal(payload.toString('utf8'), madlibber.testCompleteSentence, 'Client call to submit word with all words should return a sentence');
            t.end();
        }));
    });
});

tape('autocompleteHandler returns a list of words matching the beginning of the input', function(t) {
    t.plan(10);
    var wordType = 'adverbs';
    var wordFragment = 'ab';
    var randomise = false;
    hyperquest.get('http://localhost:8000/auto?fragment=' + wordFragment + '&type=' + wordType + '&randomise=' + randomise, function(error, response) {
        response.pipe(concat(function(payload) {
            JSON.parse(payload.toString('utf8')).suggestions.forEach(function(word) {
                t.ok(word.search(wordFragment) === 0, 'Assert ' + word + ' starts with ' + wordFragment);
            });
        }));
    });
});

tape('autocompleteHandler should return a random list of words if randomise is set to true', function(t) {
    t.plan(10);
    var wordType = 'nouns';
    var wordFragment = 'be';
    var randomise = true;
    hyperquest.get('http://localhost:8000/auto?fragment=' + wordFragment + '&type=' + wordType + '&randomise=' + randomise, function(error, response) {
        response.pipe(concat(function(payload) {
            JSON.parse(payload.toString('utf8')).suggestions.forEach(function(word) {
                t.ok(word.search(wordFragment) === 0, 'Assert ' + word + 'starts with ' + wordFragment);
            });
        }));
    });
});

// check content of autocomplete, submitHandler
tape.onFinish(function() {
    app.server.close();
});
