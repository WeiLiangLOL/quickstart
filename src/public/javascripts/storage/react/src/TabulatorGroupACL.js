class TabulatorGroupACL extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            el: React.createRef(),
            tabulator: null,
        };
    }

    componentDidMount() {
        //instantiate Tabulator when element is mounted
        this.state.tabulator = new Tabulator(this.el, {
            columns: [
                { title: 'Group', field: 'groupname', editor: 'input' },
                { title: 'Role', field: 'rolename', editor: 'input' },
                { title: 'read', field: 'read_bit', editor: 'tickCross' },
                { title: 'write', field: 'write_bit', editor: 'tickCross' },
                { title: 'propagate', field: 'propagate', editor: 'tickCross' },
                {
                    title: 'permissionid',
                    field: 'permissionid',
                    visible: false,
                },
                {
                    title: 'action',
                    formatter: 'buttonCross',
                    width: 40,
                    align: 'center',
                    cellClick: (e, cell) => {
                        deleteGroupACL(
                            cell,
                            this.props.type,
                            this.state.tabulator
                        );
                    },
                },
            ],
            data: this.props.acls, //link data to table
            layout: 'fitColumns',
            cellEdited: (cell) => {
                updateGroupACL(cell, this.props.type);
            },
        });
        this.props.type === 'folder'
            ? this.state.tabulator.showColumn('propagate')
            : this.state.tabulator.hideColumn('propagate');

        // Add listener
        $('button[name="createGroupPermission"]').on('click', () => {
            createGroupACL(
                this.props.id,
                this.props.type,
                this.state.tabulator
            );
        });
    }

    componentDidUpdate() {
        this.state.tabulator.replaceData(this.props.acls);
        this.props.type === 'folder'
            ? this.state.tabulator.showColumn('propagate')
            : this.state.tabulator.hideColumn('propagate');
    }

    // Cleanup
    componentWillUnmount() {
        // Remove listener
        $('button[name="createGroupPermission"]').off('click');
    }

    render() {
        return (
            <React.Fragment>
                <div>
                    <h5 style={{ float: 'left' }}>Group Permissions</h5>
                    <button
                        type="button"
                        className="btn btn-secondary btn-sm"
                        data-toggle="modal"
                        data-target="#addGroupPermModal"
                        style={{ float: 'right' }}
                    >
                        add
                    </button>
                    <div style={{ clear: 'both' }}></div>
                </div>
                <span id="groupTabulatorMessage" style={{ color: 'red' }}>
                    {' '}
                </span>
                <div ref={(el) => (this.el = el)} />

                {/* Modal */}
                <div
                    className="modal fade"
                    id="addGroupPermModal"
                    tabIndex="-1"
                    role="dialog"
                    aria-labelledby="addGroupPermModalLabel"
                    aria-hidden="true"
                >
                    <div
                        className="modal-dialog modal-dialog-centered"
                        role="document"
                    >
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5
                                    className="modal-title"
                                    id="addGroupPermModalLabel"
                                >
                                    Modal title
                                </h5>
                                <button
                                    type="button"
                                    className="close"
                                    data-dismiss="modal"
                                    aria-label="Close"
                                >
                                    <span aria-hidden="true">&times;</span>
                                </button>
                            </div>
                            <div className="modal-body">
                                <div className="input-group input-group-sm mb-1">
                                    <div className="input-group-prepend">
                                        <span className="input-group-text">
                                            group
                                        </span>
                                    </div>
                                    <input
                                        type="text"
                                        className="form-control"
                                        name="group_groupname"
                                    />
                                </div>
                            </div>
                            <div className="modal-body">
                                <div className="input-group input-group-sm mb-1">
                                    <div className="input-group-prepend">
                                        <span className="input-group-text">
                                            role
                                        </span>
                                    </div>
                                    <input
                                        type="text"
                                        className="form-control"
                                        name="group_rolename"
                                    />
                                </div>
                            </div>
                            <div className="modal-body">
                                <div className="input-group input-group-sm mb-1">
                                    <div className="input-group-prepend">
                                        <span className="input-group-text">
                                            read
                                        </span>
                                    </div>
                                    <input
                                        type="checkbox"
                                        className="form-control"
                                        name="group_read_bit"
                                    />
                                </div>
                            </div>
                            <div className="modal-body">
                                <div className="input-group input-group-sm mb-1">
                                    <div className="input-group-prepend">
                                        <span className="input-group-text">
                                            write
                                        </span>
                                    </div>
                                    <input
                                        type="checkbox"
                                        className="form-control"
                                        name="group_write_bit"
                                    />
                                </div>
                            </div>
                            {this.props.type === 'folder' && (
                                <div className="modal-body">
                                    <div className="input-group input-group-sm mb-1">
                                        <div className="input-group-prepend">
                                            <span className="input-group-text">
                                                propagate
                                            </span>
                                        </div>
                                        <input
                                            type="checkbox"
                                            className="form-control"
                                            name="group_propagate"
                                        />
                                    </div>
                                </div>
                            )}
                            <div className="modal-footer">
                                <button
                                    type="button"
                                    className="btn btn-secondary"
                                    data-dismiss="modal"
                                >
                                    Close
                                </button>
                                <button
                                    type="button"
                                    className="btn btn-primary"
                                    data-dismiss="modal"
                                    name="createGroupPermission"
                                >
                                    Save changes
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </React.Fragment>
        );
    }
}
