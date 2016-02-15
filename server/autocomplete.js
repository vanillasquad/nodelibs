var fs = require('fs');

function importWords(path, container, field) {
    fs.readFile(__dirname + '/' + path, function(error, content) {
        if (error) {
            console.log(error);
        } else {
            container[field] = content.toString('utf8').split('\n');
        }
    });
}

var dictionaries = {nouns: null, adjectives: null, adverbs: null, verbs: null};
importWords('../data/index.noun.txt', dictionaries, 'nouns');
importWords('../data/index.adj.txt', dictionaries, 'adjectives');
importWords('../data/index.adv.txt', dictionaries, 'adverbs');
importWords('../data/index.verb.txt', dictionaries, 'verbs');

function getDictionary(partOfSpeech) {
    return {
        findMatches: findMatches,
        words: dictionaries[partOfSpeech]
    };
}

var findMatches = function(wordFragment, numberWordsReturned, randomise) {
    var matches = [];
    for (var i = 0; i < this.words.length; i++) {
        if (this.words[i].search(wordFragment) === 0) {
            matches.push(this.words[i]);
        }
    }
    if (randomise) {
        // returns random 10 words from matches starting with wordFragment
        var randomMatches = [];
        while (randomMatches.length < Math.min(numberWordsReturned, matches.length)) {
            var randomNum = Math.floor(Math.random() * matches.length);
            randomMatches.push(this.words.splice(randomNum, 1));
        }
        return randomMatches;
    } else {
        // returns first 10 words from matches starting with wordFragment
        return matches.slice(0, numberWordsReturned);
    }
};

module.exports = {
    getDict: getDictionary
};
