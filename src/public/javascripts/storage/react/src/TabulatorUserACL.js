
class TabulatorUserACL extends React.Component {

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
                {title: 'Name', field: 'username', editor: 'input'},
                {title: 'read', field: 'read_bit', editor: 'tickCross'},
                {title: 'write', field: 'write_bit', editor: 'tickCross'},
                {title: 'propagate', field: 'propagate', editor: 'tickCross'},
                {title: 'permissionid', field: 'permissionid', visible: false},
                {title: 'action', formatter:"buttonCross", width:40, align:"center", cellClick: (e, cell) => {deleteUserACL(cell, this.props.type, this.state.tabulator)}},
            ],
            data: this.props.acls, //link data to table
            layout:"fitColumns",
            cellEdited: (cell) => {updateUserACL(cell, this.props.type)},
        });
        this.props.type === 'folder' ? this.state.tabulator.showColumn('propagate') : this.state.tabulator.hideColumn('propagate');

        // Add listener
        $('button[name="createUserPermission"]').on('click', () => {
            createUserACL(this.props.id, this.props.type, this.state.tabulator);
        });
    }

    componentDidUpdate() {
        this.state.tabulator.replaceData(this.props.acls);
        this.props.type === 'folder' ? this.state.tabulator.showColumn('propagate') : this.state.tabulator.hideColumn('propagate');
    }

    // Cleanup
    componentWillUnmount() {
        // Remove listener
        $('button[name="createUserPermission"]').off('click');
    }

    render(){
        return (
            <React.Fragment>
                <div>
                    <h5 style={{float: "left"}}>User Permissions</h5>
                    <button type="button" className="btn btn-secondary btn-sm" data-toggle="modal" data-target="#addUserPermModal" style={{float: "right"}}>add</button>
                    <div style={{clear: "both"}}></div>
                </div>
                <span id="userTabulatorMessage" style={{color: "red"}}> </span>
                <div ref={el => (this.el = el)} />

                {/* Modal */}
                <div className="modal fade" id="addUserPermModal" tabIndex="-1" role="dialog" aria-labelledby="addUserPermModalLabel" aria-hidden="true">
                    <div className="modal-dialog modal-dialog-centered" role="document">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title" id="addUserPermModalLabel">Modal title</h5>
                                <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                                    <span aria-hidden="true">&times;</span>
                                </button>
                            </div>
                            <div className="modal-body">
                                <div className="input-group input-group-sm mb-1">
                                    <div className="input-group-prepend">
                                        <span className="input-group-text">name</span>
                                    </div>
                                    <input type="text" className="form-control" name="user_username" />
                                </div>
                            </div>
                            <div className="modal-body">
                                <div className="input-group input-group-sm mb-1">
                                    <div className="input-group-prepend">
                                        <span className="input-group-text">read</span>
                                    </div>
                                    <input type="checkbox" className="form-control" name="user_read_bit" />
                                </div>
                            </div>
                            <div className="modal-body">
                                <div className="input-group input-group-sm mb-1">
                                    <div className="input-group-prepend">
                                        <span className="input-group-text">write</span>
                                    </div>
                                    <input type="checkbox" className="form-control" name="user_write_bit" />
                                </div>
                            </div>
                            {this.props.type === 'folder' &&
                                <div className="modal-body">
                                    <div className="input-group input-group-sm mb-1">
                                        <div className="input-group-prepend">
                                            <span className="input-group-text">propagate</span>
                                        </div>
                                        <input type="checkbox" className="form-control" name="user_propagate" />
                                    </div>
                                </div>
                            }
                            <div className="modal-footer">
                                <button type="button" className="btn btn-secondary" data-dismiss="modal">Close</button>
                                <button type="button" className="btn btn-primary" data-dismiss="modal" name="createUserPermission">Save changes</button>
                            </div>
                        </div>
                    </div>
                </div>
            </React.Fragment>
        );
    }

}
