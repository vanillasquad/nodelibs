var tape = require('tape');
var hyperquest = require('hyperquest');
var app = require('../server/app.js');

tape('server returns 200 on homepage', function(t) {
    hyperquest('http://localhost:8000/', function(error, response) {
        t.equal(response.statusCode, 200);
        t.end();
    });
});

test('teardown', function(t) {
    app.close();
    t.end();
});
