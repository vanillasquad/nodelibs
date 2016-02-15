var madlibs = require('../server/madlibs.js');
var currentMadLib = {};
var userBlanks = [];

function reset() {
    // [0] at some point needs to be random
    var randomLib = Math.floor(Math.random() * madlibs.get.length);
    userBlanks = [];
    // console.log(randomLib);
    currentMadLib = madlibs.get[randomLib];
    // console.log(currentMadLib);
    return currentMadLib.required;
}

function fillBlank(word) {
    var required = currentMadLib.required;
    //check if user has completed madlib    
    userBlanks.push(word);
    if (userBlanks.length === required.length){
        return generateSentence(userBlanks, currentMadLib.sentences);
    } else {
        //else if madlib is incomplete
        return "";
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
    return completed;
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
    "required": ["noun","verb","noun", "adjective"],
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
