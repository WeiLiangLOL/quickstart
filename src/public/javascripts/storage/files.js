
// Onload
myAjax.listGroups()
    .then((groupArray) => {
        loadGroupList(groupArray);
        loadFileList(groupArray);
    });
const vw = Math.max(document.documentElement.clientWidth || 0, window.innerWidth || 0);
if (vw >= '768') {
    $('#sidebar').toggleClass('active');
    $('#sidebarCollapse').toggleClass('active');
}

// Display message for 3 seconds
var elementId = 'showMessage';
var storedtimeout;
function showMsg(message) {
    document.getElementById(elementId).innerHTML = message;
    document.getElementById(elementId).style.display = 'inline';
    clearTimeout(storedtimeout);
    storedtimeout = setTimeout(
        function() { document.getElementById(elementId).style.display = 'none'; },
        3000
    );
}

// Displays all groups
function loadGroupList(groupArray) {
    const groupList = document.getElementById('groupList');
    var list = '';
    groupArray.forEach((group) => {
        const groupname = group.groupname;
        const _groupname = group.groupname.replace(/\./g, '_');
        list += '<a class="list-group-item list-group-item-secondary list-group-item-action" '
        + 'role="tab" '
        + 'data-toggle="list" '
        + 'id="list-' + _groupname + '-list" '
        + 'href="#list-' + _groupname + '" '
        + 'aria-controls="' + _groupname + '" '
        + `onclick="ensureJSTree('` + groupname + `');">`
        + groupname
        + '</a>';
    });
    groupList.innerHTML = list;
}

// Generate multiple containers
// Each containers will later be populated with a jstrees of a different group
function loadFileList(groupArray) {
    const fileList = document.getElementById('fileList');
    var list = '';
    groupArray.forEach((group) => {
        const groupname = group.groupname;
        const _groupname = group.groupname.replace(/\./g, '_');
        list += '<div class="tab-pane fade" '
            + 'id="list-' + _groupname + '" '
            + 'role="tabpanel" '
            + 'aria-labelledby="list-' + _groupname + '-list">'
            + '<h4>' + groupname + ' </h4>'
            + `<a href="#" class="refreshSymbol" onclick="loadJSTree('` + groupname + `'); return false;">&nbsp</a>`
            + `<a href="#" class="pinSymbol" onclick="togglePin('list-` + _groupname + `'); return false;">&nbsp&nbsp</a>`
            + '<div class="scrollWrapper"><table id="' + _groupname + '-Table"></table></div>'
            + '<span style="font-size: 1.5em;">&nbsp</span>'
            //+ '<form id="' + _groupname + '-Upload" action="/api/regular_files" method="post" enctype="multipart/form-data">'
            + `<form id="` + _groupname + `-Upload" action="/api/regular_files" method="post" enctype="multipart/form-data" onsubmit="event.preventDefault(); uploadFile('` + _groupname + `');">`
                + '<input id="' + _groupname + '-UploadLocation" name="directoryid" type="hidden" />'
                + '<input id="' + _groupname + '-UploadFile" name="file" type="file" multiple />'
                + `<input type="submit" value="upload" />`
            + '</form>'
        + '</div>';
    });
    fileList.innerHTML = list;
}

// Set form to perform ajax
function uploadFile(_groupname) {
    const directoryid = $('#' + _groupname + '-UploadLocation').val();
    const fileInput = $('#' + _groupname + '-UploadFile');
    var i;

    for (i = 0; i < fileInput[0].files.length; i++) {
        var formData = new FormData();
        formData.append('directoryid', directoryid);
        formData.append('file', fileInput[0].files[i]);
        $.ajax({
            type: 'POST',
            url: '/api/regular_files',
            data: formData,
            contentType: false,
            processData: false,
        }).done((res) => {
            showMsg('Success');
            const idName = '#' + _groupname + '-Table';
            const fileTree = $(idName).jstree(true);
            const parentNode = fileTree.get_node(directoryid);
            fileTree.load_node(parentNode);
            fileTree.open_node(parentNode);
        }).fail((error) => {
            showMsg(error);
            fileTree.refresh();
        });
    }

}

/**
 * Pins a jstree (by adding a css class) (called by loadFileList)
 */
function togglePin(id) {
    document.getElementById(id).classList.toggle('pinJSTree');
}

/**
 * Only generate jstree if it hasn't been generated
 */
function ensureJSTree(groupname) {
    const idName = '#' + groupname.replace(/\./g, '_') + '-Table';
    if (!$(idName).jstree(true)) {
        loadJSTree(groupname);
    }
}

/**
 * Generates a jstree
 */
function loadJSTree(groupname) {
    const idName = '#' + groupname.replace(/\./g, '_') + '-Table';
    // Clear the folder table
    $(idName).jstree("destroy").empty();
    // Create jstree instance with custom options
    $(idName).jstree(treeConfig(groupname));
    // Add listen events for jstree
    addJSTreeListeners(groupname);
}

function treeConfig(groupname) {
    return {
        'core': {
            // Prevent invalid operations here
            'check_callback': function (operation, node, parent, position, more) {
                // prevent moving a child above or below the root
                if (parent.id === "#") return false;
                // Copy operation not supported
                if (operation === "copy_node") return false;
                // Only folder can contain children
                if (parent.type !== 'folder') return false;
                // allow everything else
                return true;
            },
            // Lazy loading
            'data': function (node, callback) {
                if(node.id === '#') { // Retrieve root element
                    getRoot(groupname, node, callback);
                }
                else { // Retrieve subsequent child element
                    getChild(groupname, node, callback);
                }
            },
            // Set default value for new folder
            'strings': { 'New node' : 'NewFolder' },
        },
        'plugins': ['contextmenu', 'dnd', 'sort', 'state', 'types', 'unique', 'wholerow'],
        // Maintain expanded state after navigating away
        'state': { 'key': groupname },
        // Customise context menu
        'contextmenu': {
            'items': function(o, cb) { // Delete 'copy' button from context menu
                var menu = $.jstree.defaults.contextmenu.items(o, cb);
                delete menu.ccp; // Remove cut, copy, paste buttons
                if (o.type === 'folder') {
                    menu.create.label = 'New Folder'; // Rename label
                    return menu;
                } else if (o.type === 'file') { // Quick hack: Change create button to download button
                    var fileMenu = {
                        download: {
                            "separator_before" : false,
                            "separator_after" : true,
                            "_disabled" : false,
                            "label" : "Download",
                            "action" : function (data) {
                                var inst = $.jstree.reference(data.reference),
                                obj = inst.get_node(data.reference);
                                const fileid = obj.id.replace(/^f/, '');
                                location.href = '/api/regular_files/' + fileid + '/download';
                            }
                        },
                        rename: menu.rename,
                        remove: menu.remove,
                    }
                    return fileMenu;
                }
            }
        },
        // Set icon
        'types': {
            'folder': {
                'icon': 'jstree-folder',
            },
            'file': {
                'icon': 'jstree-file',
             },
        }
    };
}

function addJSTreeListeners(groupname) {
    // Variables
    const idName = '#' + groupname.replace(/\./g, '_') + '-Table';
    const fileTree = $(idName).jstree(true);
    // Select listener
    $(idName).on('select_node.jstree', function (e, data) {
        modifyUploadFormFields(groupname, data);
        if (data.node.type === 'folder') {
            showFolderMetaData(groupname, data);
            //showFolderPermissions(groupname, data);
        } else if (data.node.type === 'file') {
            showFileMetaData(groupname, data);
            // showFilePermissions(groupname, data);
        }
    });
    // Create listener
    $(idName).on('create_node.jstree', function (e, data) {
        createDirectory(groupname, fileTree, data);
    });
    // Rename listener
    $(idName).on('rename_node.jstree', function (e, data) {
        // Name unchanged, nothing to do
        if (data.text === data.old) return;
        // Change name
        if (data.node.type === 'folder') {
            renameFolder(fileTree, data);
        } else if (data.node.type === 'file') {
            renameFile(fileTree, data);
        } else {
            showMsg('Unknown type ' + data.node.type);
        }
    });
    // Delete listener
    $(idName).on('delete_node.jstree', function (e, data) {
        // Delete node
        if (data.node.type === 'folder') {
            deleteFolder(fileTree, data);
        } else if (data.node.type === 'file') {
            deleteFile(fileTree, data);
        } else {
            showMsg('Unknown type ' + data.node.type);
        }
    });
    // Move listener (within tree)
    $(idName).on('move_node.jstree', function (e, data) {
        if (data.node.type === 'folder') {
            moveFolder(fileTree, data);
        } else if (data.node.type === 'file') {
            moveFile(fileTree, data);
        } else {
            showMsg('Unknown type ' + data.node.type);
        }
    });
    // Move listener (Across trees)
    $(document).on('dnd_stop.vakata', function (e, data) {
        // Quick workaround hack as move listener not firing across trees
        const sourceNode = fileTree.get_node(data.element);
        const targetParent = fileTree.get_node(data.event.target);
        // Moving within tree
        if (sourceNode && targetParent) return;
        // Moving across trees
        moveAcrossTrees(sourceNode, targetParent, fileTree);
    });
    // Copy folder listener
    $(idName).on('copy_node.jstree', function (e, data) {
        showMsg('Operation not supported');
    });
    // Double click listener (to download files)
    $(idName).on('dblclick.jstree', function (e) {
        // Get selected node
        const node = $(idName).jstree().get_selected(true)[0];
        // Download if selected node is a file
        if (node.type === 'file') {
            const fileid = node.id.replace(/^f/, '');
            location.href = '/api/regular_files/' + fileid + '/download';
        }
    });
}
