var http = require('http');
var port = process.env.PORT || 8000;

function init(router, port) {
    return http.createServer(router).listen(port);
}

module.exports = {
    init: init,
    port: port
};
