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
 * @param {Function} callback
 */
function start(callback) {
    if (process.env.NODE_ENV === 'production') {
        callback({
            underscored: true,
            timestamps: true,
        });
    } else {
        const pg_params = pg.settings.options.concat(['start']);

        // Generate empty dirs
        require('./dir-sync').sync();

        // Start service
        pg.service = execFile(
            pg.settings.command,
            pg_params,
            (error, stdout, stderr) => {
                // Break instantly on failure
                if (error) throw error;
            }
        );

        // Supposed to be in execFile handler, but it seems gimmicky
        setTimeout(
            () =>
                callback({
                    schema: 'quickstart',
                    underscored: true,
                    timestamps: false,
                }),
            2000
        );
    }
}

/**
 * Ends postgres service
 */
function end() {
    if (pg.service) {
        pg.service.kill();
    }
}

module.exports = {
    start: start,
    end: end,
};
