var tape = require('tape');
var hyperquest = require('hyperquest');
var concat = require('concat-stream');
var app = require('../server/app.js');
var fs = require('fs');

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

// check content of autocomplete, submitHandler
