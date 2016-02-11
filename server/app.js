var server = require('./server.js');
var router = require('./router.js');

var s = server.init(router.router, server.port);

module.exports = {
    server: s
};
