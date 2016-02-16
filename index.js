var displayRequired = document.getElementById('required');
var errorMessage = document.getElementById('error-message');
var wordForm = document.getElementById('word-form');
var madlib = document.getElementById('madlib');
var required;

document.getElementById('start').addEventListener('click', function(e) {
    errorMessage.innerHTML = '';
    madlib.innerHTML = '';
    var start = new XMLHttpRequest();
    e.target.classList.toggle('hidden');
    document.querySelector('.form').classList.toggle('hidden');
    // this.className = 'btn';
    start.addEventListener('load', function(evt) {
        document.getElementById('word-form').classList.toggle('invisible');

        console.log(required);

        var response = JSON.parse(evt.target.response);
        displayRequired.innerHTML = response.nextHint;
        required = response.partOfSpeech;

    });
    start.open('GET', '/start-madlibber');
    start.send();
});

document.getElementById('word-form').firstElementChild.addEventListener('input', function(e) {
    var options = {
        fragment: e.target.value,
        type: required,
        randomise: 'true',
    };
    if (options.fragment && options.fragment.length > 0) {
        var queryString = Object.keys(options).map(function(key) {
            return key + '=' + options[key];
        }).join('&');

        var xhr = new XMLHttpRequest();
        xhr.open('GET', '/auto?' + queryString);
        xhr.send();

        xhr.addEventListener('load', function(evt) {
            var container = document.getElementById('suggestions');
            var list = document.createElement('ul');
            container.innerHTML = '';
            JSON.parse(evt.target.response).suggestions.forEach(function(word) {
                var opt = document.createElement('li');
                opt.innerHTML = word;
                opt.class = 'autocomplete-option';
                opt.addEventListener('click', autofill);
                list.appendChild(opt);
            });
            container.appendChild(list);
        });
    } else {
        document.getElementById('suggestions').innerHTML = '';
    }
});

function autofill(evt) {
    document.getElementById('word-form').firstElementChild.value = evt.target.innerHTML;
}

document.getElementById('word-form').addEventListener('submit', function(e) {
    e.preventDefault();


    function showLoadScreen() {
    	var screenContainer = document.getElementById('loading-screen');
    	screenContainer.classList.add('visible');
    	screenContainer.classList.remove('invisible');
    	setTimeout(function() {
    		screenContainer.classList.add('invisible');
    		screenContainer.classList.remove('visible');
    	}, 3000);
    }
    var submitWord = new XMLHttpRequest();
    var word = e.target.firstElementChild.value;

    submitWord.addEventListener('load', function(evt) {
        var container = document.getElementById('suggestions');
        wordForm.firstElementChild.value = '';

        var httpStatus = Math.floor(evt.target.status/100);
        var response = JSON.parse(evt.target.response);
        if (httpStatus === 4 || httpStatus === 5) {
            errorMessage.innerHTML = response.error;
        } else if (response.completed) {
            document.querySelector('.form').classList.add('hidden');
            document.querySelector('.form').classList.add('invisible');
            document.getElementById('start').classList.remove('hidden');
            document.getElementById('start').classList.remove('invisible');
            showLoadScreen();
            errorMessage.innerHTML = '';
            container.innerHTML = '';
            madlib.innerHTML = response.data;
            displayRequired.innerHTML = '';
        } else {
            errorMessage.innerHTML = '';
            displayRequired.innerHTML = response.nextHint;
            required = response.partOfSpeech;
        }
        e.target.firstElementChild.value = '';
        container.innerHTML = '';
    });
    submitWord.open('GET', '/submit-word:' + word);
    submitWord.send();
});
