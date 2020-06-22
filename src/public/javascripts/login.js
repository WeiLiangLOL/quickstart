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
var msgTimeout;

if (params.success == 'false') {
    clearTimeout(msgTimeout);
    document.getElementById('err-msg').style.display = 'block';
    msgTimeout = setTimeout(() => {
        document.getElementById('err-msg').style.display = 'none';
    }, 3000);
}
