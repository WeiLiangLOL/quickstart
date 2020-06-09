const path = require('path');
const { execFile } = require('child_process');
const debug = require('debug')('quickstart:database');

const pg = {
    service: null,
    settings: {
        command: path.join(__dirname, '../pgsql/bin/pg_ctl.exe'),
        options: [
            '-D',
            './pgsql/data',
            '-l',
            './pgsql/logfile',
            '-o',
            `"-p 5432"`,
        ],
    },
};

/**
 * Starts postgres service
 *
 * @throws Error if failed to start postgres
 */
function start() {
    // Production environment, nothing to do
    if (process.env.NODE_ENV === 'production') {
        return;
    }
    
    // Development environment
    
    // Generate empty dirs (that are missing)
    require('./dir-sync').sync();

    // Start postgres service
    pg.service = execFile(
        pg.settings.command,
        pg.settings.options.concat(['restart']), // Warning: Quick hack for npm run debug
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
    if (pg.service) {
        pg.service.kill();
    }
}

module.exports = {
    start: start,
    stop: stop,
};
