const path = require('path');
const { execFile } = require('child_process');
const debug = require('debug')('quickstart:database');

// Might use .env for this in future
const pg_settings = {
    command: path.join(__dirname, '../pgsql/bin/pg_ctl.exe'),
    options: [
        '-D', './pgsql/data',
        '-l', './pgsql/logfile',
        '-o', `"-p 5432"`
    ]
}

/**
 * Starts postgres service
 * 
 * @param {Function} callback 
 */
function start(callback) {
    if (process.env.NODE_ENV === 'production') {
        callback({
            underscored: true,
            timestamps: true
        });
    } else {
        const pg_params = pg_settings.options.concat(['start']);
        
        // Generate empty dirs
        require('./dir-sync').sync();

        // Start service
        execFile(pg_settings.command, pg_params, (error, stdout, stderr) => {
            // Break instantly on failure
            if (error) throw error;
        });

        // Supposed to be in execFile handler, but it seems gimmicky
        setTimeout(() => callback({
            schema: 'quickstart',
            underscored: true,
            timestamps: false
        }), 2000);
    }
}

module.exports = {
    start: start
}