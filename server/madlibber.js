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
    userBlanks.push(word);
    if (userBlanks.length === required.length){
        return generateSentence(userBlanks, currentMadLib.sentences);
    } else {
        return "";
    }
}

function generateSentence(userBlanks, fragments){
    var completed = '';
    fragments.forEach(fragment => {
        if (typeof fragment === 'string') {
            completed += fragment;
        } else {
            completed += userBlanks[fragment];
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
    "required": ["exclamation","verb","noun", "adjective"],
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
