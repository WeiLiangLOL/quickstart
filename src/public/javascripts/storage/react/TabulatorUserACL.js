var _createClass = (function () {
    function defineProperties(target, props) {
        for (var i = 0; i < props.length; i++) {
            var descriptor = props[i];
            descriptor.enumerable = descriptor.enumerable || false;
            descriptor.configurable = true;
            if ('value' in descriptor) descriptor.writable = true;
            Object.defineProperty(target, descriptor.key, descriptor);
        }
    }
    return function (Constructor, protoProps, staticProps) {
        if (protoProps) defineProperties(Constructor.prototype, protoProps);
        if (staticProps) defineProperties(Constructor, staticProps);
        return Constructor;
    };
})();

function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
        throw new TypeError('Cannot call a class as a function');
    }
}

function _possibleConstructorReturn(self, call) {
    if (!self) {
        throw new ReferenceError(
            "this hasn't been initialised - super() hasn't been called"
        );
    }
    return call && (typeof call === 'object' || typeof call === 'function')
        ? call
        : self;
}

function _inherits(subClass, superClass) {
    if (typeof superClass !== 'function' && superClass !== null) {
        throw new TypeError(
            'Super expression must either be null or a function, not ' +
                typeof superClass
        );
    }
    subClass.prototype = Object.create(superClass && superClass.prototype, {
        constructor: {
            value: subClass,
            enumerable: false,
            writable: true,
            configurable: true,
        },
    });
    if (superClass)
        Object.setPrototypeOf
            ? Object.setPrototypeOf(subClass, superClass)
            : (subClass.__proto__ = superClass);
}

var TabulatorUserACL = (function (_React$Component) {
    _inherits(TabulatorUserACL, _React$Component);

    function TabulatorUserACL(props) {
        _classCallCheck(this, TabulatorUserACL);

        var _this = _possibleConstructorReturn(
            this,
            (
                TabulatorUserACL.__proto__ ||
                Object.getPrototypeOf(TabulatorUserACL)
            ).call(this, props)
        );

        _this.state = {
            el: React.createRef(),
            tabulator: null,
        };
        return _this;
    }

    _createClass(TabulatorUserACL, [
        {
            key: 'componentDidMount',
            value: function componentDidMount() {
                var _this2 = this;

                //instantiate Tabulator when element is mounted
                this.state.tabulator = new Tabulator(this.el, {
                    columns: [
                        { title: 'Name', field: 'username', editor: 'input' },
                        {
                            title: 'read',
                            field: 'read_bit',
                            editor: 'tickCross',
                        },
                        {
                            title: 'write',
                            field: 'write_bit',
                            editor: 'tickCross',
                        },
                        {
                            title: 'propagate',
                            field: 'propagate',
                            editor: 'tickCross',
                        },
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
                            cellClick: function cellClick(e, cell) {
                                deleteUserACL(
                                    cell,
                                    _this2.props.type,
                                    _this2.state.tabulator
                                );
                            },
                        },
                    ],
                    data: this.props.acls, //link data to table
                    layout: 'fitColumns',
                    cellEdited: function cellEdited(cell) {
                        updateUserACL(cell, _this2.props.type);
                    },
                });
                this.props.type === 'folder'
                    ? this.state.tabulator.showColumn('propagate')
                    : this.state.tabulator.hideColumn('propagate');

                // Add listener
                $('button[name="createUserPermission"]').on(
                    'click',
                    function () {
                        createUserACL(
                            _this2.props.id,
                            _this2.props.type,
                            _this2.state.tabulator
                        );
                    }
                );
            },
        },
        {
            key: 'componentDidUpdate',
            value: function componentDidUpdate() {
                this.state.tabulator.replaceData(this.props.acls);
                this.props.type === 'folder'
                    ? this.state.tabulator.showColumn('propagate')
                    : this.state.tabulator.hideColumn('propagate');
            },

            // Cleanup
        },
        {
            key: 'componentWillUnmount',
            value: function componentWillUnmount() {
                // Remove listener
                $('button[name="createUserPermission"]').off('click');
            },
        },
        {
            key: 'render',
            value: function render() {
                var _this3 = this;

                return React.createElement(
                    React.Fragment,
                    null,
                    React.createElement(
                        'div',
                        null,
                        React.createElement(
                            'h5',
                            { style: { float: 'left' } },
                            'User Permissions'
                        ),
                        React.createElement(
                            'button',
                            {
                                type: 'button',
                                className: 'btn btn-secondary btn-sm',
                                'data-toggle': 'modal',
                                'data-target': '#addUserPermModal',
                                style: { float: 'right' },
                            },
                            'add'
                        ),
                        React.createElement('div', { style: { clear: 'both' } })
                    ),
                    React.createElement(
                        'span',
                        { id: 'userTabulatorMessage', style: { color: 'red' } },
                        ' '
                    ),
                    React.createElement('div', {
                        ref: function ref(el) {
                            return (_this3.el = el);
                        },
                    }),
                    React.createElement(
                        'div',
                        {
                            className: 'modal fade',
                            id: 'addUserPermModal',
                            tabIndex: '-1',
                            role: 'dialog',
                            'aria-labelledby': 'addUserPermModalLabel',
                            'aria-hidden': 'true',
                        },
                        React.createElement(
                            'div',
                            {
                                className: 'modal-dialog modal-dialog-centered',
                                role: 'document',
                            },
                            React.createElement(
                                'div',
                                { className: 'modal-content' },
                                React.createElement(
                                    'div',
                                    { className: 'modal-header' },
                                    React.createElement(
                                        'h5',
                                        {
                                            className: 'modal-title',
                                            id: 'addUserPermModalLabel',
                                        },
                                        'Modal title'
                                    ),
                                    React.createElement(
                                        'button',
                                        {
                                            type: 'button',
                                            className: 'close',
                                            'data-dismiss': 'modal',
                                            'aria-label': 'Close',
                                        },
                                        React.createElement(
                                            'span',
                                            { 'aria-hidden': 'true' },
                                            '\xD7'
                                        )
                                    )
                                ),
                                React.createElement(
                                    'div',
                                    { className: 'modal-body' },
                                    React.createElement(
                                        'div',
                                        {
                                            className:
                                                'input-group input-group-sm mb-1',
                                        },
                                        React.createElement(
                                            'div',
                                            {
                                                className:
                                                    'input-group-prepend',
                                            },
                                            React.createElement(
                                                'span',
                                                {
                                                    className:
                                                        'input-group-text',
                                                },
                                                'name'
                                            )
                                        ),
                                        React.createElement('input', {
                                            type: 'text',
                                            className: 'form-control',
                                            name: 'user_username',
                                        })
                                    )
                                ),
                                React.createElement(
                                    'div',
                                    { className: 'modal-body' },
                                    React.createElement(
                                        'div',
                                        {
                                            className:
                                                'input-group input-group-sm mb-1',
                                        },
                                        React.createElement(
                                            'div',
                                            {
                                                className:
                                                    'input-group-prepend',
                                            },
                                            React.createElement(
                                                'span',
                                                {
                                                    className:
                                                        'input-group-text',
                                                },
                                                'read'
                                            )
                                        ),
                                        React.createElement('input', {
                                            type: 'checkbox',
                                            className: 'form-control',
                                            name: 'user_read_bit',
                                        })
                                    )
                                ),
                                React.createElement(
                                    'div',
                                    { className: 'modal-body' },
                                    React.createElement(
                                        'div',
                                        {
                                            className:
                                                'input-group input-group-sm mb-1',
                                        },
                                        React.createElement(
                                            'div',
                                            {
                                                className:
                                                    'input-group-prepend',
                                            },
                                            React.createElement(
                                                'span',
                                                {
                                                    className:
                                                        'input-group-text',
                                                },
                                                'write'
                                            )
                                        ),
                                        React.createElement('input', {
                                            type: 'checkbox',
                                            className: 'form-control',
                                            name: 'user_write_bit',
                                        })
                                    )
                                ),
                                this.props.type === 'folder' &&
                                    React.createElement(
                                        'div',
                                        { className: 'modal-body' },
                                        React.createElement(
                                            'div',
                                            {
                                                className:
                                                    'input-group input-group-sm mb-1',
                                            },
                                            React.createElement(
                                                'div',
                                                {
                                                    className:
                                                        'input-group-prepend',
                                                },
                                                React.createElement(
                                                    'span',
                                                    {
                                                        className:
                                                            'input-group-text',
                                                    },
                                                    'propagate'
                                                )
                                            ),
                                            React.createElement('input', {
                                                type: 'checkbox',
                                                className: 'form-control',
                                                name: 'user_propagate',
                                            })
                                        )
                                    ),
                                React.createElement(
                                    'div',
                                    { className: 'modal-footer' },
                                    React.createElement(
                                        'button',
                                        {
                                            type: 'button',
                                            className: 'btn btn-secondary',
                                            'data-dismiss': 'modal',
                                        },
                                        'Close'
                                    ),
                                    React.createElement(
                                        'button',
                                        {
                                            type: 'button',
                                            className: 'btn btn-primary',
                                            'data-dismiss': 'modal',
                                            name: 'createUserPermission',
                                        },
                                        'Save changes'
                                    )
                                )
                            )
                        )
                    )
                );
            },
        },
    ]);

    return TabulatorUserACL;
})(React.Component);
