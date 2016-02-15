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
        var container = document.getElementById('suggestions');
        var list = document.createElement('ul');
        container.innerHTML = '';
        JSON.parse(evt.target.response).suggestions.forEach(function(word) {
            var opt = document.createElement('ul');
            opt.value = word;
            datalist.appendChild(opt);
        });
    });
});

document.getElementById('word-form').addEventListener('submit', function(e) {

});
