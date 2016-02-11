var server = require('./server.js');
var router = require('./router.js');

var startServer = server.init();

module.exports = {
    startServer : startServer
};
