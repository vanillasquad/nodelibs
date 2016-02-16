var madlibs = require('../server/madlibs.js');
var currentMadLib = {};
var userBlanks = [];

function getNextWordData(field) {
    console.log('userBlanks=',userBlanks, ': currentMadLib[field]=', currentMadLib[field]);
    return (userBlanks.length < currentMadLib[field].length) ? currentMadLib[field][userBlanks.length] : "";
}

function reset() {
    // [0] at some point needs to be random
    var randomLib = Math.floor(Math.random() * madlibs.get.length);
    userBlanks = [];
    currentMadLib = madlibs.get[randomLib];
    return {
        "hint": getNextWordData('hints'),
        "partOfSpeech": getNextWordData('required'),
    };
}

function fillBlank(word) {
    userBlanks.push(word);
    if (getNextWordData('hints')){
        //if madlib is incomplete
        return {
            "completed": false,
            "nextHint": getNextWordData('hints'),
            "partOfSpeech": getNextWordData('required'),
            "data": "",
        };
    } else {
        return {
            "completed": true,
            "nextHint": "",
            "partOfSpeech": "",
            "data": generateSentence(userBlanks, currentMadLib.sentences),
        };
    }
}

function generateSentence(userBlanks, sentences){
    var completed = '';
    sentences.forEach(sentenceFragment => {
        if (typeof sentenceFragment === 'string') {
            completed += sentenceFragment;
        } else {
            completed += userBlanks[sentenceFragment];
        }
    });
    // return completed.replace(/\.\s(\w)/gi, function(match, p1) {
    //     return '. ' + p1.toUpperCase();
    // });
}

// Getters are for testing purposes only
function currentMadLibGetter (){
    return currentMadLib;
}
function currentMadLibSetter(set) {
    currentMadLib = set;
    return currentMadLib;
}
function userBlanksGetter() {
    return userBlanks;
}
function userBlanksSetter(set) {
    userBlanks = set;
    return userBlanks;
}

var testMadlibObj = {
    "sentences": [ 0,"! he said ", 1 ," as he jumped into his convertible exclamation ",2," and drove off with his ", 3 ," wife." ],
    "required": ["nouns","verbs","nouns", "adjectives"],
    "hints": ["noun (proper)","verb (past tense)","noun (any)", "adjective"],
};
var testUserBlanksAlmostFull = ['table', 'chair', 'house'];
var testCompleteSentence = 'table! he said chair as he jumped into his convertible exclamation house and drove off with his going wife.';


module.exports = {
    reset: reset,
    fillBlank: fillBlank,
    userBlanksGetter: userBlanksGetter,
    userBlanksSetter: userBlanksSetter,
    currentMadLibGetter: currentMadLibGetter,
    currentMadLibSetter: currentMadLibSetter,
    testMadlibObj: testMadlibObj,
    testUserBlanksAlmostFull: testUserBlanksAlmostFull,
    testCompleteSentence: testCompleteSentence
};
