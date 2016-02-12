var http = require('http');
var colors = require('colors');

var apiKey = 'b231dda8ea9e189ffe00d053ea506a8cbd045e2269a103e07';
function checkWord(word, callback) {
    console.log('check word fired......');
    var options = {
        hostname: 'api.wordnik.com',
        path: '/v4/word.json/'+ word + '/definitions?limit=1&includeRelated=true&useCanonical=false&includeTags=false&api_key=' + apiKey
    };
    http.get(options, function( apiResponse) {
        var data = '';
        apiResponse.on('data', function(chunk) {
            data += chunk;
        });
        apiResponse.on('end', function() {
            data = JSON.parse(data);
            //if wordnik doesn't recognise the word
            if(data.length === 0){
                return callback('try a different word');
            }
            else {
                return callback(data[0].partOfSpeech);
            // callback function will take the type of word as arg
            }
        });
    });
}


module.exports = {
    checkWord: checkWord
};
