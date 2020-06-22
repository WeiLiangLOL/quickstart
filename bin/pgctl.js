const path = require('path');
const { execFile } = require('child_process');

const command = './pgsql/bin/pg_ctl.exe';
const options = [
    '-D',
    './pgsql/data',
    '-l',
    './pgsql/logfile',
    '-o',
    `"-p 5432"`,
];

/**
 * Starts postgres service
 */
function start() {
    execFile(
        command,
        options.concat(['restart']), // Warning: Quick hack for npm run debug
        (error, stdout, stderr) => {
            // Break instantly on failure
            if (error) {
                throw error;
            }
        }
    );
}

/**
 * Stops postgres service
 */
function stop() {
    execFile(command, options.concat(['stop']));
}

module.exports = {
    start: start,
    stop: stop,
};
