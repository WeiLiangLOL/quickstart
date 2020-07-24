
// Display message for 3 seconds
var tabulatorMsgTimeout;
function metaShowMsg(element, message) {
    document.getElementById(element).innerHTML = message;
    document.getElementById(element).style.display = 'inline';
    clearTimeout(tabulatorMsgTimeout);
    tabulatorMsgTimeout = setTimeout(function () {
        document.getElementById(element).style.display = 'none';
    }, 3000);
}

function createUserACL(id, type, tabulator) {
    var data = {
        username: $('input[name="user_username"]').val(),
        read_bit: $('input[name="user_read_bit"]:checked').val() === 'on' ? true : false,
        write_bit: $('input[name="user_write_bit"]:checked').val() === 'on' ? true : false,
        propagate: $('input[name="user_propagate"]:checked').val() === 'on' ? true : false,
    };
    if (type === 'folder') {
        data.directoryid = id;
        myAjax.createUserDirACL(data).then(() => {
            tabulator.addData([data]);
        }).catch((error) => {
            metaShowMsg('userTabulatorMessage', 'failure');
        });
    } else {
        data.fileid = id;
        delete data.propagate;
        myAjax.createUserFileACL(data).then(() => {
            tabulator.addData([data]);
        }).catch((error) => {
            metaShowMsg('userTabulatorMessage', 'failure');
        });
    }
}

function createGroupACL(id, type, tabulator) {
    var data = {
        directoryid: id,
        groupname: $('input[name="group_groupname"]').val(),
        rolename: $('input[name="group_rolename"]').val().toLowerCase(),
        read_bit: $('input[name="group_read_bit"]:checked').val() === 'on' ? true : false,
        write_bit: $('input[name="group_write_bit"]:checked').val() === 'on' ? true : false,
        propagate: $('input[name="group_propagate"]:checked').val() === 'on' ? true : false,
    };
    if (type === 'folder') {
        data.directoryid = id;
        myAjax.createGroupDirACL(data).then(() => {
            tabulator.addData([data]);
        }).catch((error) => {
            metaShowMsg('groupTabulatorMessage', 'failure');
        });
    } else {
        data.fileid = id;
        delete data.propagate;
        myAjax.createGroupFileACL(data).then(() => {
            tabulator.addData([data]);
        }).catch((error) => {
            metaShowMsg('groupTabulatorMessage', 'failure');
        });
    }
}

function updateUserACL(cell, type) {
    var promise;
    const data = cell.getRow().getData();
    var newData = {
        username: data.username,
        read_bit: data.read_bit,
        write_bit: data.write_bit,
    };
    if (type === 'folder') {
        newData.propagate = data.propagate;
        promise = myAjax.updateUserDirACL(data.permissionid, newData);
    } else {
        promise = myAjax.updateUserFileACL(data.permissionid, newData);
    }

    promise.catch((error) => {
        metaShowMsg('userTabulatorMessage', 'Failure');
        cell.restoreOldValue();
    });
}

function updateGroupACL(cell, type) {
    var promise;
    const data = cell.getRow().getData();
    var newData = {
        groupname: data.groupname,
        rolename: data.rolename,
        read_bit: data.read_bit,
        write_bit: data.write_bit,
    };
    if (type === 'folder') {
        newData.propagate = data.propagate;
        promise = myAjax.updateGroupDirACL(data.permissionid, newData);
    } else {
        promise = myAjax.updateGroupFileACL(data.permissionid, newData);
    }

    promise.catch((error) => {
        metaShowMsg('groupTabulatorMessage', 'failure');
        cell.restoreOldValue();
    });
}

function deleteUserACL(cell, type, tabulator) {
    var promise;
    if (type === 'folder') {
        promise = myAjax.deleteUserDirACL(cell.getRow().getData().permissionid);
    } else {
        promise = myAjax.deleteUserFileACL(cell.getRow().getData().permissionid);
    }
    promise.then(() => {
        cell.getRow().delete();
    }).catch((error) => {
        metaShowMsg('userTabulatorMessage', 'failure');
    });
}

function deleteGroupACL(cell, type, tabulator) {
    var promise;
    if (type === 'folder') {
        promise = myAjax.deleteGroupDirACL(cell.getRow().getData().permissionid);
    } else {
        promise = myAjax.deleteGroupFileACL(cell.getRow().getData().permissionid);
    }
    promise.then(() => {
        cell.getRow().delete();
    }).catch((error) => {
        metaShowMsg('groupTabulatorMessage', 'failure');
    });
}
