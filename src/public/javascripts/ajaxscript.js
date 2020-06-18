function listGroups(callback) {
    var xhttp = new XMLHttpRequest();
    xhttp.onload = function () {
        callback(JSON.parse(this.responseText));
    };
    xhttp.open('GET', '/api/groups/', true);
    xhttp.send();
}

function createDirectory(groupname, callback) {
    var xhttp = new XMLHttpRequest();
    xhttp.onload = function () {
        callback(this);
    };
    xhttp.open('POST', '/api/directories/', true);
    xhttp.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
    directoryname = basePattern.test(groupname)
        ? basePattern.exec(groupname)[1]
        : groupname;
    var params = 'groupname=' + groupname + '&directoryname=' + directoryname;
    xhttp.send(params);
}

function readDirectory(groupname, callback) {
    var xhttp = new XMLHttpRequest();
    xhttp.onload = function () {
        callback(JSON.parse(this.responseText));
    };
    xhttp.open(
        'GET',
        '/api/directories/?groupname=' + groupname + '&directoryname=root',
        true
    );
    xhttp.send();
}
