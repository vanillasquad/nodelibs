var http = require('http');

var apiKey = process.env.API_KEY;

function checkWord(word, errorCallback, successCallback) {
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
                return errorCallback() ;
            }
            else {
                return successCallback(data[0].partOfSpeech);
            // callback function will take the type of word as arg
            }
        });
    });
}


module.exports = {
    checkWord: checkWord
};
