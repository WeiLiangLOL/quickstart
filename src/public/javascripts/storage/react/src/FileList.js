// Generate multiple containers
// Each containers will later be populated with a jstrees of a different group
class FileList extends React.Component {
    fileItem(groupname, _groupname) {
        return (
            <div
                className="tab-pane fade"
                role="tabpanel"
                id={'filelist-' + _groupname}
                key={'filelist-' + _groupname}
                aria-labelledby={'grouplist-' + _groupname}
            >
                <h4>{groupname}</h4>
                <a
                    href="#"
                    className="refreshSymbol"
                    onClick={() => loadJSTree(groupname)}
                >
                    &nbsp;
                </a>
                <a
                    href="#"
                    className="pinSymbol"
                    onClick={() => togglePin('filelist-' + _groupname)}
                >
                    &nbsp;&nbsp;
                </a>
                <div className="scrollWrapper">
                    <table id={_groupname + '-Table'}></table>
                </div>
                <span style={{ fontSize: '1.5em' }}>&nbsp;</span>
                <form
                    id={_groupname + '-Upload'}
                    action="/api/regular_files"
                    method="post"
                    encType="multipart/form-data"
                    onSubmit={() => {
                        event.preventDefault();
                        uploadFile(_groupname);
                    }}
                >
                    <input
                        id={_groupname + '-UploadLocation'}
                        name="directoryid"
                        type="hidden"
                    />
                    <input
                        id={_groupname + '-UploadFile'}
                        name="file"
                        type="file"
                        multiple
                    />
                    <input type="submit" value="upload" />
                </form>
            </div>
        );
    }

    render() {
        return (
            <React.Fragment>
                {this.props.groupArray.map(({ groupname, _groupname }) =>
                    this.fileItem(groupname, _groupname)
                )}
            </React.Fragment>
        );
    }
}
