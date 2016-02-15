var tape = require('tape');
var wordnik = require('../server/wordnik.js');

tape('wordnik recieves a response from the wordnik api', function(t) {
    wordnik.checkWord('table', function(apiResponse) {
        t.equal(typeof apiResponse, 'string', 'checkWord returns a string from wordnik');
        t.end();
    });
});

tape('wordnik checkWord should return the type of word', function(t) {
    wordnik.checkWord('table', function(apiResponse) {
        t.equal(apiResponse, 'noun', 'returns the type of word');
        t.end();
    });
});

tape('wordnik should log error', function(t) {
    wordnik.checkWord('ajsdkhajksdh', function(apiResponse) {
        t.equal(apiResponse, 'try a different word', 'returns an error message');
        t.end();
    });
});
