// Script for displaying error message
// Checks value of GET parameter 'success'
// Code from: https://stackoverflow.com/a/21210643/6943913
function getSearchParams() {
    var queryDict = {};
    location.search
        .substr(1)
        .split('&')
        .forEach(
            (item) => (queryDict[item.split('=')[0]] = item.split('=')[1])
        );
    return queryDict;
}

let params = getSearchParams();
if (params.success == 'false') {
    document.getElementById('err-msg').innerHTML =
        'Invalid username or password.';
}
