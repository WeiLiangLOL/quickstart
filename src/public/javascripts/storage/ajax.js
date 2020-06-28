var myAjax = {
    // files.js
    listGroups: function () {
        return $.get('/api/groups/');
    },

    readDirectory: function (directoryid) {
        return $.get('/api/directories/' + directoryid);
    },

    createDirectory: function (directoryname, groupname) {
        return $.post('/api/directories', {
            directoryname: directoryname,
            groupname: groupname,
        });
    },

    updateDirectory: function (directoryid, newData) {
        return $.ajax({
            type: 'PUT',
            url: '/api/directories/' + directoryid,
            data: newData,
            timeout: 5000,
        });
    },

    deleteDirectory: function (directoryid) {
        return $.ajax({
            type: 'DELETE',
            url: '/api/directories/' + directoryid,
            timeout: 5000,
        });
    },

    readRegularFile: function (fileid) {
        return $.get('/api/regular_files/' + fileid);
    },

    updateRegularFile: function (fileid, newData) {
        return $.ajax({
            type: 'PUT',
            url: '/api/regular_files/' + fileid,
            data: newData,
            timeout: 5000,
        });
    },

    deleteFile: function (fileid) {
        return $.ajax({
            type: 'DELETE',
            url: '/api/regular_files/' + fileid,
            timeout: 5000,
        });
    },
};

/*
function readDirectory(groupname, callback) {
    var xhttp = new XMLHttpRequest();
    xhttp.onload = function () {
        callback(JSON.parse(this.responseText));
    };
    xhttp.open('GET', '/api/directories/?groupname=' + groupname, true);
    xhttp.send();
}
*/
