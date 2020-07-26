class MetaList extends React.Component {
    isLockedOnClick() {
        $('#metalistvalueid-islocked').on('click', () => {
            const element = document.getElementById('metalistvalueid-islocked');
            const islocked = element.innerHTML === 'true';
            myAjax
                .updateRegularFile(this.props.id, {
                    islocked: !islocked,
                })
                .then(() => {
                    element.innerHTML = !islocked;
                });
        });
    }

    componentDidMount() {
        this.isLockedOnClick();
    }

    componentDidUpdate() {
        const element = document.getElementById('metalistvalueid-islocked');
        if (element) {
            element.innerHTML = this.props.data.islocked;
            $('#metalistvalueid-islocked').off('click');
            this.isLockedOnClick();
        }
    }

    render() {
        return (
            <React.Fragment>
                <h4>{this.props.name}</h4>
                <table>
                    <tbody>
                        {Object.keys(this.props.data).map((key) => {
                            return (
                                <tr key={'metalistdatakey-' + key}>
                                    <td style={{ paddingRight: '20px' }}>
                                        {key}
                                    </td>
                                    <td id={'metalistvalueid-' + key}>
                                        {this.props.data[key]}
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
                <br />

                <TabulatorUserACL
                    type={this.props.type}
                    id={this.props.id}
                    acls={this.props.user_acls}
                />
                <br />

                <TabulatorGroupACL
                    type={this.props.type}
                    id={this.props.id}
                    acls={this.props.dir_acls}
                />
            </React.Fragment>
        );
    }
}
