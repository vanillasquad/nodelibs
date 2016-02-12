var autocomplete = require('../server/autocomplete.js');
var tape = require('tape');

tape('checks if correct dictionary is chosen', function(t) {
    t.equal(firstWord, autocomplete.getDict[0], 'Checks dictionary choice');
    t.end();
});

// autocomplete.getDict should return array of strings(words)
