
/**
 * This file contains all methods used by JSTree in files.js
 */

// Get the first folder of the jstree
function getRoot(groupname, node, callback) {
        $.get('/api/directories/?directoryname=root&groupname='+groupname, function(data, status){
            callback([{
                'text' : data[0].directoryname,
                'id' : data[0].directoryid,
                'type': 'folder',
                'children' : true,
                'state': { opened: true },
                'data' : { groupname: groupname },
            }]);
        });
}

// Get subsequent child folder/file of the jstree
function getChild(groupname, node, callback) {
    const dirAjax = $.get('/api/directories/' + node.id + '/children', function(dirArray, status){
        dirArray.forEach((item, i, arr) => {
            arr[i].text = basePattern.exec(item.text)[1];
            arr[i].type = 'folder';
            arr[i].data = { groupname: groupname };
        });
        return dirArray;
    });
    const fileAjax = $.get('/api/regular_files/?directoryid=' + node.id, function(fileArray, status){
        fileArray.forEach((item, i, arr) => {
            arr[i].id = 'f' + item.fileid;
            arr[i].text = item.filename;
            arr[i].type = 'file';
            arr[i].data = { groupname: groupname };
        });
        return fileArray;
    });
    Promise.all([dirAjax, fileAjax]).then(([dirArray, fileArray]) => {
        callback(dirArray.concat(fileArray));
    });
}

function modifyUploadFormFields(groupname, data) {
    // data = { node, selected[], event }
    const _groupname = groupname.replace(/\./g, '_');
    // Set directoryid which file will be uploaded to
    document.getElementById(_groupname + '-UploadLocation').value = data.node.id;
    // Set form visibility, show form if folder is selected, hide form if file is selected
    if (data.node.id.substring(0, 1) !== 'f') {
        $('#' + _groupname + '-Upload').css('display', 'inline');
    } else {
        $('#' + _groupname + '-Upload').css('display', 'none');
    }
}

function showFolderMetaData(groupname, data) {
    // data = { node, selected[], event }
    myAjax.readDirectory(data.node.id)
        .done((dir) => {
            document.getElementById('metaList').innerHTML = '';
            buildHtmlTable('#metaList', dir);
        });
}
function showFileMetaData(groupname, data) {
    // data = { node, selected[], event }
    myAjax.readRegularFile(data.node.id.replace(/^f/, ''))
        .done((dir) => {
            document.getElementById('metaList').innerHTML = '';
            buildHtmlTable('#metaList', dir);
        });
}

function createDirectory(groupname, fileTree, data) {
    // data = { node, parent(id), position }
    const parentName = fileTree.get_path(data.parent, '.', false);
    const directoryname = parentName + '.' + data.node.text;
    myAjax.createDirectory(directoryname, groupname)
        .done((res) => { // res = { directoryid, directoryname, groupname }
            showMsg('Success');
            fileTree.set_id(data.node, res.directoryid);
            fileTree.set_type(data.node, 'folder');
        }).fail((error) => {
            showMsg(error.statusText);
            //fileTree.refresh();
            fileTree.refresh(data.node);
        });
}

function renameFolder(fileTree, data) {
    // data = { node, text(newname), old }
    const parentNode = fileTree.get_parent(data.node);
    const parentPath = fileTree.get_path(parentNode, '.', false);
    const directoryid = data.node.id;
    const newData = {
        directoryname: parentPath + '.' + data.text,
    };
    myAjax.updateDirectory(directoryid, newData)
        .done((res) => { // res = { directoryid, directoryname, groupname }
            showMsg('Success');
        }).fail((error) => {
            showMsg(error.statusText);
            fileTree.refresh(data.node);
        });
}

function renameFile(fileTree, data) {
    // data = { node, text(newname), old }
    const fileid = data.node.id.replace(/^f/, '');
    const newData = {
        filename: data.text,
    };
    myAjax.updateRegularFile(fileid, newData)
        .done((res) => {
            showMsg('Success');
        }).fail((error) => {
            showMsg(error.statusText);
            fileTree.refresh(data.node);
        });
}

function deleteFolder(fileTree, data) {
    // data = { node, parent(id) }
    myAjax.deleteDirectory(data.node.id)
        .done((res) => { // res = { message, rows }
            showMsg('Success');
        }).fail((error) => {
            showMsg(error.statusText);
            fileTree.refresh(data.node);
        });
}

function deleteFile(fileTree, data) {
    // data = { node, parent(id) }
    const fileid = data.node.id.replace(/^f/, '');
    myAjax.deleteFile(fileid)
        .done((res) => { // res = { message, rows }
            showMsg('Success');
        }).fail((error) => {
            showMsg(error.statusText);
            fileTree.refresh(data.node);
        });
}

function moveFolder(fileTree, data) {
    // data = { node, parent(id), position, old_parent, old_position, is_multi, old_instance, new_instance }
    const directoryid = data.node.id;
    const newPath = fileTree.get_path(data.node.parent, '.', false);
    const newData = {
            directoryname: newPath + '.' + data.node.text,
        };
    myAjax.updateDirectory(directoryid, newData)
        .done((res) => {
            // res = { directoryid, directoryname, groupname }
            showMsg('Success');
        }).fail((error) => {
            showMsg(error.statusText);
            fileTree.refresh(data.node);
        });
}

function moveFile(fileTree, data) {
    // data = { node, parent(id), position, old_parent, old_position, is_multi, old_instance, new_instance }
    const fileid = data.node.id.replace(/^f/, '');
    const newData = {
        directoryid: data.parent,
    };
    myAjax.updateRegularFile(fileid, newData)
        .done((res) => {
            showMsg('Success');
        }).fail((error) => {
            showMsg(error.statusText);
            fileTree.refresh(data.node);
        });
}

// bad hack of moveFolder for moving across trees
// due to event not firing
var sourceNode = null;
var sourceFileTree = null;
var targetParent = null;
var targetFileTree = null;
// bad hack of moveFolder for moving across trees
// due to event not firing
function moveAcrossTrees(sn, tp, fileTree) {
    if (sn) {
        sourceNode = sn;
        sourceFileTree = fileTree;
    }
    if (tp) {
        targetParent = tp;
        targetFileTree = fileTree;
    }

    // WARNING: Potential multi execution, use mutex
    if (sourceNode && targetParent) {
        if (targetParent.type === 'folder'){
            if (sourceNode.type === 'folder') {
                moveFolderAcrossTrees(sourceNode, sourceFileTree, targetParent, targetFileTree);
            } else if (sourceNode.type === 'file') {
                moveRegularFileAcrossTrees(sourceNode, sourceFileTree, targetParent, targetFileTree);
            }
        } else {
            showMsg('Cannot target non folders');
        }
        // reset variables
        sourceNode = null;
        sourceFileTree = null;
        targetParent = null;
        targetFileTree = null;
    }
}
// bad hack of moveFolder() for moving across trees
// due to event not firing
function moveFolderAcrossTrees(node, sourceFT, parent, targetFT) {
    // Move folder
    const newPath = targetFT.get_path(parent, '.', false);
    const newData = {
            directoryname: newPath + '.' + node.text,
            groupname: parent.data.groupname,
        };
    myAjax.updateDirectory(node.id, newData)
        .done((res) => { // res = { directoryid, directoryname, groupname }
            showMsg('Success');
            // Reload trees
            sourceFT.load_node(sourceFT.get_parent(node));
            targetFT.load_node(parent);
        }).fail((error) => {
        showMsg(error.statusText);
            // Refresh trees
            sourceFT.refresh();
            targetFT.refresh();
        });
}
// bad hack of moveFile() for moving across trees
// due to event not firing
function moveRegularFileAcrossTrees(node, sourceFT, parent, targetFT) {
    // Move file
    const fileid = node.id.replace(/^f/, '');
    const newData = {
        directoryid: parent.id,
    };
    myAjax.updateRegularFile(fileid, newData)
        .done((res) => {
            showMsg('Success');
            // Reload trees
            sourceFT.load_node(sourceFT.get_parent(node));
            targetFT.load_node(parent);
        }).fail((error) => {
            // Refresh trees
            sourceFT.refresh();
            targetFT.refresh();
            showMsg(error.statusText);
        });
}
