var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

// Generate multiple containers
// Each containers will later be populated with a jstrees of a different group
var FileList = function (_React$Component) {
    _inherits(FileList, _React$Component);

    function FileList() {
        _classCallCheck(this, FileList);

        return _possibleConstructorReturn(this, (FileList.__proto__ || Object.getPrototypeOf(FileList)).apply(this, arguments));
    }

    _createClass(FileList, [{
        key: "fileItem",
        value: function fileItem(groupname, _groupname) {
            return React.createElement(
                "div",
                {
                    className: "tab-pane fade",
                    role: "tabpanel",
                    id: "filelist-" + _groupname,
                    key: "filelist-" + _groupname,
                    "aria-labelledby": "grouplist-" + _groupname },
                React.createElement(
                    "h4",
                    null,
                    groupname
                ),
                React.createElement(
                    "a",
                    { href: "#", className: "refreshSymbol", onClick: function onClick() {
                            return loadJSTree(groupname);
                        } },
                    "\xA0"
                ),
                React.createElement(
                    "a",
                    { href: "#", className: "pinSymbol", onClick: function onClick() {
                            return togglePin("filelist-" + _groupname);
                        } },
                    "\xA0\xA0"
                ),
                React.createElement(
                    "div",
                    { className: "scrollWrapper" },
                    React.createElement("table", { id: _groupname + '-Table' })
                ),
                React.createElement(
                    "span",
                    { style: { fontSize: "1.5em" } },
                    "\xA0"
                ),
                React.createElement(
                    "form",
                    { id: _groupname + "-Upload", action: "/api/regular_files", method: "post", encType: "multipart/form-data", onSubmit: function onSubmit() {
                            event.preventDefault();uploadFile(_groupname);
                        } },
                    React.createElement("input", { id: _groupname + "-UploadLocation", name: "directoryid", type: "hidden" }),
                    React.createElement("input", { id: _groupname + "-UploadFile", name: "file", type: "file", multiple: true }),
                    React.createElement("input", { type: "submit", value: "upload" })
                )
            );
        }
    }, {
        key: "render",
        value: function render() {
            var _this2 = this;

            return React.createElement(
                React.Fragment,
                null,
                this.props.groupArray.map(function (_ref) {
                    var groupname = _ref.groupname,
                        _groupname = _ref._groupname;
                    return _this2.fileItem(groupname, _groupname);
                })
            );
        }
    }]);

    return FileList;
}(React.Component);