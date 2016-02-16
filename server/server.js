var http = require('http');
var env = require('env2')('./.env');
var port = process.env.PORT || 8000;

function init(router, port) {
    var server = http.createServer(router);
    server.listen(port);
    return server;
}

module.exports = {
    init: init,
    port: port
};
