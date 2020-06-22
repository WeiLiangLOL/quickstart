// Regex patterns for validating ltree datatype
const isValidTopLevel = /^\w+$/;
const isValidNonTopLevel = /^\w+\.[\.\w]*\w+$/;
const basePattern = /\.?(\w+)$/;
const dirPattern = /([\w\.]+)\.\w+$/;

/**
 * Generates a clickable link pointing to a javascript function
 *
 * @param {function} func - The function to be executed on clicked
 * @param {array} paramArray - An array of parameters, will be passed to the function individually
 * @param {string} name - The displayed text of the link
 */
function genLink(func, paramArray, name) {
    var params = ``;
    var i = 0;
    if (i < paramArray.length) params = `'` + paramArray[i++] + `'`;
    while (i < paramArray.length) {
        params += `, '` + paramArray[i++] + `'`;
    }

    return (
        '<a href="#" onclick="' + func + '(' + params + ')">' + name + '</a>'
    );
}
