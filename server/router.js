var handler = require('./handlers.js');

var resourceWhitelist = ['/index.html', '/index.js', '/style.css', '/img/nodelibs-logo.png', '/img/node-face-1.png', '/img/node-face-2.png', '/img/node-face-3.png'];

function router(request, response) {
    if (request.url.length === 1) {
        handler.homeHandler(request,response);
    } else if (resourceWhitelist.indexOf(request.url) > -1) {
        handler.resourceHandler(request, response);
    } else if (request.url.search('/submit-word') === 0) {
        handler.submitHandler(request, response);
    } else if (request.url.search('/auto') === 0) {
        handler.autocompleteHandler(request, response);
    } else if (request.url.indexOf('/start-madlibber') === 0){
        handler.startHandler(request, response);
    } else {
        handler.notFoundHandler(request, response);
    }
}

module.exports = {
    router: router
};
