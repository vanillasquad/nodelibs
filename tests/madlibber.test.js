var tape = require('tape');
var madlibber = require('../server/madlibber.js');
// var madlibs = require('../server/madlibs.js');
var testMadlibObj = {
    "sentences": [ 0,"! he said ", 1 ," as he jumped into his convertible exclamation ",2," and drove off with his ", 3 ," wife." ],
    "required": ["noun","verb","noun", "adjective"],
};
var testUserBlanksFull = ['table', 'chair', 'house', 'going'];

tape('madlib contains reset() function that returns the next part of speech', function(t) {
    var actual = madlibber.reset();
    t.equal(typeof actual, 'string', 'reset returns a string');
    t.end();
});

tape('madlib reset() function resets userBlanks', function(t) {
    madlibber.userBlanksSetter(testUserBlanksFull);
    t.equal(madlibber.userBlanksGetter(), testUserBlanksFull, 'set userBlanks');
    madlibber.reset();
    var actual = madlibber.userBlanksGetter();
    t.equal(actual.length, 0, 'reset function resets userBlanks array');
    t.end();
});

tape('madlib reset() function sets currentMadLib object', function(t) {
    madlibber.reset();
    var actual = madlibber.currentMadLibGetter();
    t.equal(typeof actual, 'object', 'currentMadlib is an object');
    t.notDeepEqual(actual, {}, 'currentMadlib is an empty object');
    t.end();
});

tape('testing fillBlank function if part of speech is correct', function(t) {
    madlibber.currentMadLibSetter(testMadlibObj);
    var responseObject = madlibber.fillBlank('table');
    t.equal(responseObject.data, '');
    t.equal(responseObject.completed, false);
    t.ok(responseObject.partOfSpeech.length > 0, 'if userBlanks length is less than required, it returns next part of speech required');

    madlibber.userBlanksSetter(['table', 'chair', 'house']);
    madlibber.currentMadLibSetter(testMadlibObj);
    t.equal(madlibber.fillBlank('going').data, 'table! he said chair as he jumped into his convertible exclamation house and drove off with his going wife.', 'if userBlanks is the same length as required, returns a sentence');
    t.end();
});
