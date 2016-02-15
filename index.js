document.getElementById('word-form').firstElementChild.addEventListener('input', function(e) {
    var options = {
        fragment: e.target.value,
        type: 'nouns',
        randomise: 'true',
    };

    var queryString = Object.keys(options).map(function(key) {
        return key + '=' + options[key];
    }).join('&');

    var xhr = new XMLHttpRequest();
    xhr.open('GET', 'http://localhost:8000/auto?' + queryString);
    xhr.send();

    xhr.addEventListener('load', function(evt) {
        console.log(evt.target.response);
    });
});

document.getElementById('word-form').addEventListener('submit', function(e) {

});
