
class GroupList extends React.Component {

    groupItem(groupname, _groupname) {
        return (
            <a className="list-group-item list-group-item-secondary list-group-item-action"
            role="tab"
            data-toggle="list"
            key={"grouplist-" + _groupname}
            id={"grouplist-" + _groupname}
            href={"#filelist-" + _groupname}
            aria-controls={"filelist-" + _groupname}
            onClick={() => ensureJSTree(groupname)} >
                {groupname}
            </a>
        );
    }

    render() {
        return (
            <div id="groupList" className="list-group" role="tablist">
                {
                    this.props.groupArray.map(({groupname, _groupname}) => this.groupItem(groupname, _groupname))
                }
            </div>
        );
    }

}
