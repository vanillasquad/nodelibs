var handler = require('./handlers.js');

var resourceWhitelist = ['/index.html', '/index.js', '/style.css'];

function router(request, response) {
    if (request.url.length === 1) {
        handler.homeHandler(request,response);
    } else if (resourceWhitelist.indexOf(request.url) > -1) {
        handler.resourceHandler(request, response);
    } else {
        handler.notFoundHandler(request, response);
    }
}

module.exports = {
    router: router
};
