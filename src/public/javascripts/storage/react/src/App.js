// React App entry point
myAjax.listGroups().then((groupArray) => {
    groupArray = groupArray.map((group) => {
        return {
            groupname: group.groupname,
            _groupname: group.groupname.replace(/\./g, '_'),
        };
    });

    ReactDOM.render(
        <Main groupArray={groupArray} />,
        document.getElementById('rootPane')
    );
});

function displayMetaList(groupname, data) {
    var promise;
    if (data.node.id.substring(0, 1) === 'f') {
        // file
        promise = myAjax
            .readRegularFile(data.node.id.replace(/^f/, ''))
            .then((file) => {
                //return [type, filename, fileid, data, user_acls, dir_acls];
                return [
                    'regfile',
                    file.filename,
                    file.fileid,
                    {
                        islocked: file.islocked.toString(),
                        owner: file.owner,
                        filesize: formatBytes(file.filesize),
                        created_at: dateToString(file.created_at),
                        updated_at: dateToString(file.updated_at),
                    },
                    file.user_regfile_acls,
                    file.group_regfile_acls,
                ];
            });
    } else {
        // folder
        promise = myAjax.readDirectory(data.node.id).then((dir) => {
            // return [type, dirname, dirid, data, user_acls, dir_acls]
            return [
                'folder',
                '(dir) ' + basePattern.exec(dir.directoryname)[1],
                dir.directoryid,
                {
                    group: dir.groupname,
                    path: dir.directoryname,
                },
                dir.user_dir_acls,
                dir.group_dir_acls,
            ];
        });
    }

    promise.then((arr) => {
        // arr = [type, name, id, data, user_acls, dir_acls]
        ReactDOM.render(
            <MetaList
                type={arr[0]}
                name={arr[1]}
                id={arr[2]}
                data={arr[3]}
                user_acls={arr[4]}
                dir_acls={arr[5]}
            />,
            document.getElementById('metaList')
        );
    });
}
