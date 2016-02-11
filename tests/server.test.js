var tape = require('tape');
var server = require('../server/server.js');


tape('server.js has function .init()',function(t){
    t.equal(typeof server.init, 'function', 'server.init is a function');
    t.end();
});
