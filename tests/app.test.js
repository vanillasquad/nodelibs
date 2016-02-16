var tape = require('tape');
var colors = require('colors');
var hyperquest = require('hyperquest');
var concat = require('concat-stream');
var app = require('../server/app.js');
var fs = require('fs');
var env = require('env2')('config.env');
var madlibber = require('../server/madlibber.js');

var hostUrl = process.env.HOST + ':' + process.env.PORT + '/';
// helper function, returns boolean to check if nouns verbs etc are present
function requiredPresent(payload) {
    var requiredWords = ['noun', 'verb', 'adjective'];
    return requiredWords.reduce(function(prev, curr) {
        var required = JSON.parse(payload).nextHint;
        var re = new RegExp(curr, 'i');
        return prev || (required.match(re) > -1);
    }, false);
}

tape('server returns 200 on homepage', function(t) {
    hyperquest.get(hostUrl, function(error, response) {
        t.equal(response.statusCode, 200, 'assert status code is 200');
        t.end();
    });
});

tape('request to homepage returns HTML', function(t) {
    hyperquest.get(hostUrl, function(error, response) {
        response.pipe(concat(function(payload) {
            t.ok(payload.toString('utf8').match('<!DOCTYPE html>'), 'check for DOCTYPE');
            t.ok(payload.toString('utf8').match('<html>'), 'check for HTML tag');
            t.end();
        }));
    });
});

tape('request returns style.css', function(t) {
    t.plan(3);
    ['index.html', 'index.js', 'style.css'].forEach(function(item) {
        hyperquest.get(hostUrl + item, function(error, response) {
            response.pipe(concat(function(payload) {
                fs.readFile(__dirname + '/../' + item, function(error, content) {
                    t.equal(content.toString('utf8'), payload.toString('utf8'), 'Check for '+ item +' content');
                });
            }));
        });
    });
});

tape('test 404 handler', function(t) {
    var invalidURL = 'cat';
    hyperquest.get(hostUrl + invalidURL, function(error, response) {
        response.pipe(concat(function(payload) {
            t.ok(payload.toString('utf8').match('404'), 'assert that 404 responses contain 404 in the body');
            t.end();
        }));
    });
});

tape('startHandler should return the first required word', function(t) {
    var requiredWords = ['noun', 'verb', 'adjective'];
    hyperquest.get(hostUrl + 'start-madlibber', function(error, response) {
        response.pipe(concat(function(payload) {
            t.ok(requiredPresent(payload), 'assert that startHandler returns required word');
            t.end();
        }));
    });
});

tape('submitWord endpoint calls madlibber file and returns string', function(t){
    var submitWord = 'submit-word:table';
    madlibber.currentMadLibSetter(madlibber.testMadlibObj);
    hyperquest.get(hostUrl + submitWord, function(error, response){
        response.pipe(concat(function(payload){
            var responseObject = JSON.parse(payload);
            t.equal(responseObject.completed, false ,'status should be false after first call to submitWord');
            t.equal(responseObject.data, '', 'data should be empty on first call');
            t.ok(requiredPresent(payload), 'part of speech should return noun verb etc on first call');
            t.end();
        }));
    });
});

tape('submitWord endpoint when total words are submitted returns a full sentence', function(t){
    var submitWord = 'submit-word:pretty';
    // madlibber.reset();
    madlibber.userBlanksSetter(madlibber.testUserBlanksAlmostFull);
    madlibber.currentMadLibSetter(madlibber.testMadlibObj);
    hyperquest.get(hostUrl + submitWord, function(error, response){
        response.pipe(concat(function(payload){
            t.equal(JSON.parse(payload).data, 'table! he said chair as he jumped into his convertible exclamation house and drove off with his pretty wife.', 'Client call to submit word with all words should return a sentence');
            t.end();
        }));
    });
});

tape('submitHandler returns an error when input word does not exist', function(t) {
    var submitWord = 'submit-word:hewufjkhds';
    hyperquest.get(hostUrl + submitWord, function(error, response) {
        response.pipe(concat(function(payload) {
            t.equal(JSON.parse(payload).error, 'wordnik error', 'Checks if word exists in wordnik');
            t.end();
        }));
    });
});

tape('autocompleteHandler returns a list of words matching the beginning of the input', function(t) {
    t.plan(10);
    var wordType = 'adverbs';
    var wordFragment = 'ab';
    var randomise = false;
    hyperquest.get(hostUrl + 'auto?fragment=' + wordFragment + '&type=' + wordType + '&randomise=' + randomise, function(error, response) {
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
    hyperquest.get(hostUrl + 'auto?fragment=' + wordFragment + '&type=' + wordType + '&randomise=' + randomise, function(error, response) {
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
