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

    // Create User Permissions
    createUserDirACL: function (data) {
        return $.post('/api/user_dir_acls', data);
    },
    createUserFileACL: function (data) {
        return $.post('/api/user_regfile_acls', data);
    },
    createUserDataACL: function (data) {
        return $.post('/api/user_datafile_acls', data);
    },

    // Create Group Permissions
    createGroupDirACL: function (data) {
        return $.post('/api/group_dir_acls', data);
    },
    createGroupFileACL: function (data) {
        return $.post('/api/group_regfile_acls', data);
    },
    createGroupDataACL: function (data) {
        return $.post('/api/group_datafile_acls', data);
    },

    // Update User Permissions
    updateUserDirACL: function (permissionid, newData) {
        return $.ajax({
            type: 'PUT',
            url: '/api/user_dir_acls/' + permissionid,
            data: newData,
            timeout: 5000,
        });
    },
    updateUserFileACL: function (permissionid, newData) {
        return $.ajax({
            type: 'PUT',
            url: '/api/user_regfile_acls/' + permissionid,
            data: newData,
            timeout: 5000,
        });
    },
    updateUserDataACL: function (permissionid, newData) {
        return $.ajax({
            type: 'PUT',
            url: '/api/user_datafile_acls/' + permissionid,
            data: newData,
            timeout: 5000,
        });
    },

    // Update Group permissions
    updateGroupDirACL: function (permissionid, newData) {
        return $.ajax({
            type: 'PUT',
            url: '/api/group_dir_acls/' + permissionid,
            data: newData,
            timeout: 5000,
        });
    },
    updateGroupFileACL: function (permissionid, newData) {
        return $.ajax({
            type: 'PUT',
            url: '/api/group_regfile_acls/' + permissionid,
            data: newData,
            timeout: 5000,
        });
    },
    updateGroupDataACL: function (permissionid, newData) {
        return $.ajax({
            type: 'PUT',
            url: '/api/group_datafile_acls/' + permissionid,
            data: newData,
            timeout: 5000,
        });
    },

    // Delete User Permissions
    deleteUserDirACL: function (id) {
        return $.ajax({
            type: 'DELETE',
            url: '/api/user_dir_acls/' + id,
            timeout: 5000,
        });
    },
    deleteUserFileACL: function (id) {
        return $.ajax({
            type: 'DELETE',
            url: '/api/user_regfile_acls/' + id,
            timeout: 5000,
        });
    },
    deleteUserDataACL: function (id) {
        return $.ajax({
            type: 'DELETE',
            url: '/api/user_datafile_acls/' + id,
            timeout: 5000,
        });
    },

    // Dekete Group Permissions
    deleteGroupDirACL: function (id) {
        return $.ajax({
            type: 'DELETE',
            url: '/api/group_dir_acls/' + id,
            timeout: 5000,
        });
    },
    deleteGroupFileACL: function (id) {
        return $.ajax({
            type: 'DELETE',
            url: '/api/group_regfile_acls/' + id,
            timeout: 5000,
        });
    },
    deleteGroupDataACL: function (id) {
        return $.ajax({
            type: 'DELETE',
            url: '/api/group_datafile_acls/' + id,
            timeout: 5000,
        });
    },
};
