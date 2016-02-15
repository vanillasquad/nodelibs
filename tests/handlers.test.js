var tape = require('tape');
var handlers = require('../server/handlers.js');

tape('checks that different handlers exist as functions in exported object', function(t) {
    t.equal(typeof handlers.homeHandler, 'function', 'homeHandler test');
    t.equal(typeof handlers.autocompleteHandler, 'function', 'autocompleteHandler test');
    t.equal(typeof handlers.submitHandler, 'function', 'submitHandler test');
    t.equal(typeof handlers.notFoundHandler, 'function', 'notFoundHandler test');
    t.equal(typeof handlers.startHandler, 'function', 'startHandler test');
    t.end();
});
