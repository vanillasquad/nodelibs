var autocomplete = require('../server/autocomplete.js');
var tape = require('tape');

tape('checks if correct dictionary is chosen', function(t) {
    var wordType = 'nouns';

    var dict = autocomplete.getDict(wordType);
    t.equal(typeof dict, 'object', 'Checks dictionary choice');
    t.equal(typeof dict.findMatches, 'function', 'Checks if findMatches function exists');
    t.ok(dict.words instanceof Array, 'Checks if words are returned in an array');
    t.end();
});


tape('check matches can be found for adjectives', function(t) {
    var wordType = 'adjectives';

    var dict = autocomplete.getDict(wordType);
    t.plan(10);

    var matches = dict.findMatches('fr', 10, false);
    matches.forEach(function(word) {
        t.equal(word.slice(0,2), 'fr', 'assert word starts with fr');
    });

});

// autocomplete.getDict should return object with array of strings(words), and findmatches function
