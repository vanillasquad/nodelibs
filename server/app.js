var server = require('./server.js');
var router = require('./router.js');

server.init(router.router, server.port);
