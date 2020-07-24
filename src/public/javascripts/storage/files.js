// Onload
const vw = Math.max(
    document.documentElement.clientWidth || 0,
    window.innerWidth || 0
);
if (vw >= '768') {
    $('#sidebar').toggleClass('active');
    $('#sidebarCollapse').toggleClass('active');
}

// Display message for 3 seconds
var elementId = 'fileMessage';
var storedtimeout;
function showMsg(message) {
    document.getElementById(elementId).innerHTML = message;
    document.getElementById(elementId).style.display = 'inline';
    clearTimeout(storedtimeout);
    storedtimeout = setTimeout(function () {
        document.getElementById(elementId).style.display = 'none';
    }, 3000);
}

function modifyUploadFileForm(groupname, data) {
    // data = { node, selected[], event }
    const _groupname = groupname.replace(/\./g, '_');
    // Set directoryid which file will be uploaded to
    document.getElementById(_groupname + '-UploadLocation').value =
        data.node.id;
    // Set form visibility, show form if folder is selected, hide form if file is selected
    if (data.node.id.substring(0, 1) !== 'f') {
        $('#' + _groupname + '-Upload').css('display', 'inline');
    } else {
        $('#' + _groupname + '-Upload').css('display', 'none');
    }
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
        })
            .done((res) => {
                showMsg('Success');
                const idName = '#' + _groupname + '-Table';
                const fileTree = $(idName).jstree(true);
                const parentNode = fileTree.get_node(directoryid);
                fileTree.load_node(parentNode);
                fileTree.open_node(parentNode);
            })
            .fail((error) => {
                showMsg('failure');
                const idName = '#' + _groupname + '-Table';
                const fileTree = $(idName).jstree(true);
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
    $(idName).jstree('destroy').empty();
    // Create jstree instance with custom options
    $(idName).jstree(treeConfig(groupname));
    // Add listen events for jstree
    addJSTreeListeners(groupname);
}

function treeConfig(groupname) {
    return {
        core: {
            // Prevent invalid operations here
            check_callback: function (operation, node, parent, position, more) {
                // prevent moving a child above or below the root
                if (parent.id === '#') return false;
                // Copy operation not supported
                if (operation === 'copy_node') return false;
                // Only folder can contain children
                if (parent.type !== 'folder') return false;
                // allow everything else
                return true;
            },
            // Lazy loading
            data: function (node, callback) {
                if (node.id === '#') {
                    // Retrieve root element
                    getRoot(groupname, node, callback);
                } else {
                    // Retrieve subsequent child element
                    getChild(groupname, node, callback);
                }
            },
            // Set default value for new folder
            strings: { 'New node': 'NewFolder' },
        },
        plugins: [
            'contextmenu',
            'dnd',
            'sort',
            'state',
            'types',
            'unique',
            'wholerow',
        ],
        // Maintain expanded state after navigating away
        state: { key: groupname },
        // Customise context menu
        contextmenu: {
            items: function (o, cb) {
                // Delete 'copy' button from context menu
                var menu = $.jstree.defaults.contextmenu.items(o, cb);
                delete menu.ccp; // Remove cut, copy, paste buttons
                if (o.type === 'folder') {
                    menu.create.label = 'New Folder'; // Rename label
                    return menu;
                } else if (o.type === 'file') {
                    // Quick hack: Change create button to download button
                    var fileMenu = {
                        download: {
                            separator_before: false,
                            separator_after: true,
                            _disabled: false,
                            label: 'Download',
                            action: function (data) {
                                var inst = $.jstree.reference(data.reference),
                                    obj = inst.get_node(data.reference);
                                const fileid = obj.id.replace(/^f/, '');
                                location.href =
                                    '/api/regular_files/' +
                                    fileid +
                                    '/download';
                            },
                        },
                        rename: menu.rename,
                        remove: menu.remove,
                    };
                    return fileMenu;
                }
            },
        },
        // Set icon
        types: {
            folder: {
                icon: 'jstree-folder',
            },
            file: {
                icon: 'jstree-file',
            },
        },
    };
}

function addJSTreeListeners(groupname) {
    // Variables
    const idName = '#' + groupname.replace(/\./g, '_') + '-Table';
    const fileTree = $(idName).jstree(true);
    // Select listener
    $(idName).on('select_node.jstree', function (e, data) {
        displayMetaList(groupname, data);
        modifyUploadFileForm(groupname, data);
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
