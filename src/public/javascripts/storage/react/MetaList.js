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

var MetaList = (function (_React$Component) {
    _inherits(MetaList, _React$Component);

    function MetaList() {
        _classCallCheck(this, MetaList);

        return _possibleConstructorReturn(
            this,
            (MetaList.__proto__ || Object.getPrototypeOf(MetaList)).apply(
                this,
                arguments
            )
        );
    }

    _createClass(MetaList, [
        {
            key: 'isLockedOnClick',
            value: function isLockedOnClick() {
                var _this2 = this;

                $('#metalistvalueid-islocked').on('click', function () {
                    var element = document.getElementById(
                        'metalistvalueid-islocked'
                    );
                    var islocked = element.innerHTML === 'true';
                    myAjax
                        .updateRegularFile(_this2.props.id, {
                            islocked: !islocked,
                        })
                        .then(function () {
                            element.innerHTML = !islocked;
                        });
                });
            },
        },
        {
            key: 'componentDidMount',
            value: function componentDidMount() {
                this.isLockedOnClick();
            },
        },
        {
            key: 'componentDidUpdate',
            value: function componentDidUpdate() {
                var element = document.getElementById(
                    'metalistvalueid-islocked'
                );
                if (element) {
                    element.innerHTML = this.props.data.islocked;
                    $('#metalistvalueid-islocked').off('click');
                    this.isLockedOnClick();
                }
            },
        },
        {
            key: 'render',
            value: function render() {
                var _this3 = this;

                return React.createElement(
                    React.Fragment,
                    null,
                    React.createElement('h4', null, this.props.name),
                    React.createElement(
                        'table',
                        null,
                        React.createElement(
                            'tbody',
                            null,
                            Object.keys(this.props.data).map(function (key) {
                                return React.createElement(
                                    'tr',
                                    { key: 'metalistdatakey-' + key },
                                    React.createElement(
                                        'td',
                                        { style: { paddingRight: '20px' } },
                                        key
                                    ),
                                    React.createElement(
                                        'td',
                                        { id: 'metalistvalueid-' + key },
                                        _this3.props.data[key]
                                    )
                                );
                            })
                        )
                    ),
                    React.createElement('br', null),
                    React.createElement(TabulatorUserACL, {
                        type: this.props.type,
                        id: this.props.id,
                        acls: this.props.user_acls,
                    }),
                    React.createElement('br', null),
                    React.createElement(TabulatorGroupACL, {
                        type: this.props.type,
                        id: this.props.id,
                        acls: this.props.dir_acls,
                    })
                );
            },
        },
    ]);

    return MetaList;
})(React.Component);
