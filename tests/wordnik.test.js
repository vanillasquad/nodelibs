var tape = require('tape');
var wordnik = require('../server/wordnik.js');

tape('wordnik recieves a response from the wordnik api', function(t) {
    wordnik.checkWord('table', function(){}, function(apiResponse) {
        t.equal(typeof apiResponse, 'string', 'checkWord returns a string from wordnik');
        t.end();
    });
});

tape('wordnik checkWord should return the type of word when wordnik recognises word', function(t) {
    wordnik.checkWord('table', function(){} ,function(apiResponse) {
        t.equal(apiResponse, 'noun', 'returns the type of word');
        t.end();
    });
});
//Struggled to test wordnik's error callback in isolation
//the function is covered in app.test.js 
// tape('wordnik should log error', function(t) {
//     wordnik.checkWord('ajsdkhajksdh', function() {
//         t.equal(apiResponse, 'wordnik error', 'returns an error message');
//         t.end();
//     }, function(){});
// });
