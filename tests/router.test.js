var tape = require('tape');
var router = require('../server/router.js');

tape('Test router interface', function(t) {
    t.equal(typeof router.router, 'function', 'Assert router function exists');
    t.end();
});
