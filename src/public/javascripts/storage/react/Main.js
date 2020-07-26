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

var Main = (function (_React$Component) {
    _inherits(Main, _React$Component);

    function Main() {
        _classCallCheck(this, Main);

        return _possibleConstructorReturn(
            this,
            (Main.__proto__ || Object.getPrototypeOf(Main)).apply(
                this,
                arguments
            )
        );
    }

    _createClass(Main, [
        {
            key: 'render',
            value: function render() {
                return React.createElement(
                    React.Fragment,
                    null,
                    React.createElement(
                        'div',
                        { id: 'leftPane', className: 'collapse show' },
                        React.createElement('h4', null, 'Groups'),
                        React.createElement(
                            'div',
                            { className: 'scrollWrapper' },
                            React.createElement(GroupList, {
                                groupArray: this.props.groupArray,
                            })
                        )
                    ),
                    React.createElement(
                        'a',
                        {
                            id: 'leftHandle',
                            className: 'dividing-collapse',
                            'data-toggle': 'collapse',
                            href: '#leftPane',
                            role: 'button',
                            'aria-expanded': 'true',
                            'aria-controls': 'leftPane',
                        },
                        React.createElement('span', {
                            className: 'dividing-line',
                        })
                    ),
                    React.createElement(
                        'div',
                        { id: 'centerPane' },
                        React.createElement('span', null, '\xA0'),
                        React.createElement('span', {
                            id: 'fileMessage',
                            style: { color: 'red' },
                        }),
                        React.createElement(
                            'div',
                            { className: 'tab-content' },
                            React.createElement(FileList, {
                                groupArray: this.props.groupArray,
                            })
                        )
                    ),
                    React.createElement(
                        'a',
                        {
                            id: 'rightHandle',
                            className: 'dividing-collapse',
                            'data-toggle': 'collapse',
                            href: '#rightPane',
                            role: 'button',
                            'aria-expanded': 'true',
                            'aria-controls': 'rightPane',
                        },
                        React.createElement('span', {
                            className: 'dividing-line',
                        })
                    ),
                    React.createElement(
                        'div',
                        { id: 'rightPane', className: 'collapse show' },
                        React.createElement('div', {
                            id: 'metaList',
                            className: 'scrollWrapper',
                        })
                    ),
                    React.createElement(
                        'div',
                        { style: { clear: 'both' } },
                        ' '
                    )
                );
            },
        },
    ]);

    return Main;
})(React.Component);
