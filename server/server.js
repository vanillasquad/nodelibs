var http = require('http');
var port = process.env.PORT || 8000;

function init(router, port) {
    var server = http.createServer(router);
    server.listen(port);
    console.log("Madlib server listening on port: " + port);
    return server;
}

module.exports = {
    init: init,
    port: port
};
