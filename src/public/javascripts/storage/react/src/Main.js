class Main extends React.Component {
    render() {
        return (
            <React.Fragment>
                <div id="leftPane" className="collapse show">
                    <h4>Groups</h4>
                    <div className="scrollWrapper">
                        <GroupList groupArray={this.props.groupArray} />
                    </div>
                </div>

                <a
                    id="leftHandle"
                    className="dividing-collapse"
                    data-toggle="collapse"
                    href="#leftPane"
                    role="button"
                    aria-expanded="true"
                    aria-controls="leftPane"
                >
                    <span className="dividing-line"></span>
                </a>

                <div id="centerPane">
                    <span>&nbsp;</span>
                    <span id="fileMessage" style={{ color: 'red' }}></span>
                    <div className="tab-content">
                        <FileList groupArray={this.props.groupArray} />
                    </div>
                </div>

                <a
                    id="rightHandle"
                    className="dividing-collapse"
                    data-toggle="collapse"
                    href="#rightPane"
                    role="button"
                    aria-expanded="true"
                    aria-controls="rightPane"
                >
                    <span className="dividing-line"></span>
                </a>

                <div id="rightPane" className="collapse show">
                    <div id="metaList" className="scrollWrapper"></div>
                </div>

                <div style={{ clear: 'both' }}> </div>
            </React.Fragment>
        );
    }
}
