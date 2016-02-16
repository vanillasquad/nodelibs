var displayRequired = document.getElementById('required');
var errorMessage = document.getElementById('error-message');

document.getElementById('start').addEventListener('click', function(e) {
    errorMessage.innerHTML = '';
    var start = new XMLHttpRequest();
    this.classList.toggle('hidden');
    document.getElementById('word-form').classList.toggle('hidden');
    // this.className = 'btn';
    start.addEventListener('load', function(evt) {
        document.getElementById('word-form').classList.toggle('invisible');
        console.log(required);
        requiredCounter = 0;
        displayRequired.innerHTML = JSON.parse(evt.target.response).nextHint;
    });
    start.open('GET', 'http://localhost:8000/start-madlibber');
    start.send();
});

document.getElementById('word-form').firstElementChild.addEventListener('input', function(e) {
    var options = {
        fragment: e.target.value,
        type: 'nouns',
        randomise: 'true',
    };
    if (options.fragment && options.fragment.length > 0) {
        var queryString = Object.keys(options).map(function(key) {
            return key + '=' + options[key];
        }).join('&');

        var xhr = new XMLHttpRequest();
        xhr.open('GET', 'http://localhost:8000/auto?' + queryString);
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

    //
    // function showLoadScreen() {
    // 	var screenContainer = document.getElementById('loading-screen');
    // 	screenContainer.classList.add('visible');
    // 	screenContainer.classList.remove('invisible');
    // 	setTimeout(function() {
    // 		screenContainer.classList.add('invisible');
    // 		screenContainer.classList.remove('visible');
    // 	}, 3000);
    // }
    // showLoadScreen();

    var submitWord = new XMLHttpRequest();
    var word = e.target.firstElementChild.value;

    submitWord.addEventListener('load', function(evt) {
        var errorStatus = Math.floor(evt.target.status/100);
        if (errorStatus === 4 || errorStatus === 5) {
            console.log(evt.target);
            errorMessage.innerHTML = JSON.parse(evt.target.response).error;
        } else {
            errorMessage.innerHTML = '';
            displayRequired.innerHTML = JSON.parse(evt.target.response).nextHint;
            var container = document.getElementById('suggestions');
            container.innerHTML = '';
        }
    });
    submitWord.open('GET', 'http://localhost:8000/submit-word:' + word);
    submitWord.send();
});
