const debug = require("debug")("quickstart:database-dir");
const fs = require("fs");

// generated with: find . -type d -empty
const dirs = [
    "./pgsql/data/pg_commit_ts",
    "./pgsql/data/pg_logical/mappings",
    "./pgsql/data/pg_logical/snapshots",
    "./pgsql/data/pg_replslot",
    "./pgsql/data/pg_snapshots",
    "./pgsql/data/pg_stat_tmp",
    "./pgsql/data/pg_tblspc",
    "./pgsql/data/pg_twophase",
    "./pgsql/data/pg_wal/archive_status",
];

/**
 * Local sync of directories
 */
function sync() {
    for (let dir of dirs) {
        // Synchronised create
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir);
            debug(`${dir} created`);
        }
    }
}

module.exports = {
    sync: sync,
};
