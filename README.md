# nodelibs

[![HitCount](https://hitt.herokuapp.com/{username||org}/nodelibs.svg)](https://github.com/vanillasquad/nodelibs)

![nodelibs-image](img/nodelib-logo-black.png)


## What?

Try out [nodelibs for yourself!](https://hidden-wildwood-59018.herokuapp.com/)

nodelibs is an app which is used to fill in madlibs templates. As the user types
in the text box, word suggestions will be shown dynamically as more letters are
input or deleted.

When the user submits all the required words for the madlib, the completed
madlib will be generated and shown to the user.


## Why?

To create a fun game which uses a dictionary API.

## How?

The server will be set up using node.js. The four different parts of speech we
will focus on for filling in the madlibs are nouns, verbs, adverbs, and
adjectives. These will be stored in and accessed from .txt files for the
autocomplete feature. The [Wordnik API](http://developer.wordnik.com/) will be
used to verify that the input from the user is a word.

TDD will be practiced throughout creating the project, using tape. Istanbul will
be used for checking test coverage.

The project will also be deployed to Heroku.

## Stretch Goals

* Check part of speech from Wordnik
* Include other parts of speech as suggested by Wordnik
* Check the correct verb type is entered from Wordnik
* Add validated words to the dictionary
* Suggest proper word forms eg. plural nouns, past tense verbs, etc
