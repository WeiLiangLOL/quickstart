// Regex patterns for validating ltree datatype
const isValidTopLevel = /^\w+$/;
const isValidNonTopLevel = /^\w+\.[\.\w]*\w+$/;
const basePattern = /\.?(\w+)$/;
const dirPattern = /([\w\.]+)\.\w+$/;

// Convert bytes to KB/MB/GB. Copied from https://stackoverflow.com/a/18650828/6943913
function formatBytes(a, b = 2) {
    if (0 === a) return '0 Bytes';
    const c = 0 > b ? 0 : b,
        d = Math.floor(Math.log(a) / Math.log(1024));
    return (
        parseFloat((a / Math.pow(1024, d)).toFixed(c)) +
        ' ' +
        ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'][d]
    );
}

// Convert timestamp to readable string. Code from https://stackoverflow.com/a/18537115/6943913
function dateToString(timestamp) {
    const d = new Date(timestamp);

    (minutes =
        d.getMinutes().toString().length == 1
            ? '0' + d.getMinutes()
            : d.getMinutes()),
        (hours =
            d.getHours().toString().length == 1
                ? '0' + d.getHours()
                : d.getHours()),
        (ampm = d.getHours() >= 12 ? 'pm' : 'am'),
        (months = [
            'Jan',
            'Feb',
            'Mar',
            'Apr',
            'May',
            'Jun',
            'Jul',
            'Aug',
            'Sep',
            'Oct',
            'Nov',
            'Dec',
        ]),
        (days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']);

    return (
        days[d.getDay()] +
        ' ' +
        months[d.getMonth()] +
        ' ' +
        d.getDate() +
        ' ' +
        d.getFullYear() +
        ' ' +
        hours +
        ':' +
        minutes +
        ampm
    );
}
