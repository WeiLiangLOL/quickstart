
// Onload
window.onload = () => {
    refreshGroupTable();
};

// Display message
var storedtimeout;
function showMsg(message) {
    document.getElementById("showMessage").innerHTML = message;
    document.getElementById('showMessage').style.display = 'inline';
    clearTimeout(storedtimeout);
    storedtimeout = setTimeout(
        function() { document.getElementById('showMessage').style.display = 'none'; },
        3000
    );
}

// Code for groups
function showGroupTable(){
    document.getElementById('showGroupTable').style.display = 'none';
    document.getElementById('hideGroupTable').style.display = 'inline';
    document.getElementById('groupTable').style.display = 'block';
}
function hideGroupTable(){
    document.getElementById('showGroupTable').style.display = 'inline';
    document.getElementById('hideGroupTable').style.display = 'none';
    document.getElementById('groupTable').style.display = 'none';
}
function refreshGroupTable() {
    var table = document.getElementById('groupTable');
    table.innerHTML = '';
    listGroups((arrayOfGroups) => {
        arrayOfGroups.forEach((group) => {
            table.insertRow(-1).insertCell(-1).innerHTML = genLink('refreshFolderTable', [group.groupname], group.groupname);
        });
    });
    showGroupTable();
}

// Code for files and directories
function showFolderTable(){
    document.getElementById('showFolderTable').style.display = 'none';
    document.getElementById('hideFolderTable').style.display = 'inline';
    document.getElementById('folderTable').style.display = 'block';
}
function hideFolderTable(){
    document.getElementById('showFolderTable').style.display = 'inline';
    document.getElementById('hideFolderTable').style.display = 'none';
    document.getElementById('folderTable').style.display = 'none';
}
function refreshFolderTable(groupname) {
    // Clear the folder table
    $('#folderTable').jstree("destroy").empty();
    // Repopulate folder table
    $('#folderTable').jstree({
        'core': {
            // Prevent invalid operations here
            'check_callback': function (operation, node, parent, position, more) {
                // prevent moving a child above or below the root
                if(parent.id === "#") {
                    return false;
                }
                // Copy operation not supported
                if(operation === "copy_node") {
                    return false;
                }
                // allow everything else
                return true;
            },
            // Lazy loading
            'data': function (node, callback) {
                // Retrieve root element
                if(node.id === '#') {
                    $.get('/api/directories/?directoryname=root&groupname='+groupname, function(data, status){
                        callback([{
                            'text' : data[0].directoryname,
                            'id' : data[0].directoryid,
                            'type': 'folder',
                            'children' : true,
                            'state': { opened: true }
                        }]);
                    });
                }
                // Retrieve subsequent child element
                else {
                    $.get('/api/directories/' + node.id + '/children', function(dirArray, status){
                        dirArray.forEach((item, i, arr) => {
                            arr[i].text = basePattern.exec(item.text)[1];
                            arr[i].type = 'folder';
                        });
                        $.get('/api/regular_files/?directoryid=' + node.id, function(dataArray, status){
                            dataArray.forEach((item, i, arr) => {
                                arr[i].id = 'f' + item.fileid;
                                arr[i].text = item.filename;
                                arr[i].type = 'file';
                            });
                            callback(dirArray.concat(dataArray));
                        });
                    });
                }
            },
            // Set default value for new node
            'strings': { 'New node' : 'NewFolder' },
        },
        'plugins': ['contextmenu', 'dnd', 'sort', 'state', 'types', 'unique', 'wholerow'],
        // Maintain expanded state after navigating away
        'state': { 'key': groupname },
        // Customise context menu
        'contextmenu': {
            'items': function(o, cb) {
                // Delete copy button from context menu
                var menu = $.jstree.defaults.contextmenu.items(o, cb);
                delete menu.ccp.submenu.copy;
                return menu;
            }
        },
        'types': {
            'folder': {
                'icon': 'jstree-folder'
            },
            'file': {
                'icon': 'jstree-file'
             },
             'data': {
                 'icon': ''
             }
        }
    });
    // Unhide the folderTable
    showFolderTable();
    // Variables
    var fileTree = $('#folderTable').jstree(true);
    // Select listener
    $('#folderTable').on('select_node.jstree', function (event, data) {
        // data = { node, selected[], event }
        //
        document.getElementById('directoryid').value = data.node.id;
    });
    // Create listener
    $('#folderTable').on('create_node.jstree', function (event, data) {
        // data = { node, parent(id), position }
        var parentname = fileTree.get_path(data.parent, '.', false);
        $.ajax({
            type: 'POST',
            url: '/api/directories/',
            data: {
                directoryname: parentname + '.' + data.node.text,
                groupname: groupname
            },
            timeout: 5000,
        }).done((res) => {
            // res = { directoryid, directoryname, groupname }
            showMsg('Success');
            fileTree.set_id(data.node, res.directoryid);
        }).fail((error) => {
            showMsg(error.statusText);
            fileTree.refresh(data.node);
        });
    });
    // Rename listener
    $('#folderTable').on('rename_node.jstree', function (event, data) {
        // data = { node, text(newname), old }
        var parentnode = fileTree.get_parent(data.node);
        var parentpath = fileTree.get_path(parentnode, '.', false);
        // Name unchanged, nothing to do
        if (data.text === data.old) {
            return;
        }
        $.ajax({
            type: 'PUT',
            url: '/api/directories/' + data.node.id,
            data: {
                directoryname: parentpath + '.' + data.text,
                groupname: groupname,
            },
            timeout: 5000,
        }).done((res) => {
            // res = { directoryid, directoryname, groupname }
            showMsg('Success');
        }).fail((error) => {
            showMsg(error.statusText);
            fileTree.refresh(data.node);
        });
    });
    // Delete listener
    $('#folderTable').on('delete_node.jstree', function (event, data) {
        // data = { node, parent(id) }
        var ajaxParma;
        const isFile = new RegExp(/^f/);
        if (!isFile.test(data.node.id)) {
            ajaxParam = {
                type: 'DELETE',
                url: '/api/directories/' + data.node.id,
                timeout: 5000,
            }
        } else {
            ajaxParam = {
                type: 'DELETE',
                url: '/api/regular_files/' + data.node.id.replace(/f/g, ''),
                timeout: 5000,
            }
        }
        $.ajax(ajaxParam).done((res) => {
            // res = { message, rows }
            showMsg('Success');
        }).fail((error) => {
            showMsg(error.statusText);
            fileTree.refresh(data.node);
        });
    });
    // Move folder listener
    $('#folderTable').on('move_node.jstree', function (event, data) {
        // data = { node, parent(id), position, old_parent, old_position, is_multi, old_instance, new_instance }
        var newPath = fileTree.get_path(data.node.parent, '.', false);
        $.ajax({
            type: 'PUT',
            url: '/api/directories/' + data.node.id,
            data: {
                directoryname: newPath + '.' + data.node.text,
                groupname: groupname,
            },
            timeout: 5000,
        }).done((res) => {
            // res = { directoryid, directoryname, groupname }
            showMsg('Success');
        }).fail((error) => {
            showMsg(error.statusText);
            fileTree.refresh(data.node);
        });
    });
    // Copy folder listener
    $('#folderTable').on('copy_node.jstree', function (event, data) {
        showMsg('Operation not supported');
        throw new Error('Operation not supported');
    });
}
