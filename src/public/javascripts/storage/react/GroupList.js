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

var GroupList = (function (_React$Component) {
    _inherits(GroupList, _React$Component);

    function GroupList() {
        _classCallCheck(this, GroupList);

        return _possibleConstructorReturn(
            this,
            (GroupList.__proto__ || Object.getPrototypeOf(GroupList)).apply(
                this,
                arguments
            )
        );
    }

    _createClass(GroupList, [
        {
            key: 'groupItem',
            value: function groupItem(groupname, _groupname) {
                return React.createElement(
                    'a',
                    {
                        className:
                            'list-group-item list-group-item-secondary list-group-item-action',
                        role: 'tab',
                        'data-toggle': 'list',
                        key: 'grouplist-' + _groupname,
                        id: 'grouplist-' + _groupname,
                        href: '#filelist-' + _groupname,
                        'aria-controls': 'filelist-' + _groupname,
                        onClick: function onClick() {
                            return ensureJSTree(groupname);
                        },
                    },
                    groupname
                );
            },
        },
        {
            key: 'render',
            value: function render() {
                var _this2 = this;

                return React.createElement(
                    'div',
                    {
                        id: 'groupList',
                        className: 'list-group',
                        role: 'tablist',
                    },
                    this.props.groupArray.map(function (_ref) {
                        var groupname = _ref.groupname,
                            _groupname = _ref._groupname;
                        return _this2.groupItem(groupname, _groupname);
                    })
                );
            },
        },
    ]);

    return GroupList;
})(React.Component);
