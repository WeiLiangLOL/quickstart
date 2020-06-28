// Regex patterns for validating ltree datatype
const isValidTopLevel = /^\w+$/;
const isValidNonTopLevel = /^\w+\.[\.\w]*\w+$/;
const basePattern = /\.?(\w+)$/;
const dirPattern = /([\w\.]+)\.\w+$/;

function buildHtmlTable(selector, jsonData) {
    for (var key in jsonData) {
        //if (typeof jsonData[key] === 'object') continue;
        var row$ = $('<tr/>');
        row$.append($('<td/>').html(key));
        row$.append($('<td/>').html(jsonData[key].toString()));
        $(selector).append(row$);
    }
    // Append 20 dummy rows
    var i = 20;
    while (i-- > 0) {
        var row$ = $('<tr/>');
        row$.append($('<td/>').html('Dummy'));
        row$.append($('<td/>').html('Row'));
        $(selector).append(row$);
    }
}
