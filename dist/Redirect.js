'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true,
});

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _index = require('./index');

function _interopRequireDefault(obj) {
  return obj && obj.__esModule ? obj : { default: obj };
}

var Redirect = function Redirect(_ref) {
  var _ref$status = _ref.status,
    status = _ref$status === undefined ? 301 : _ref$status,
    _ref$headers = _ref.headers,
    headers = _ref$headers === undefined ? {} : _ref$headers,
    to = _ref.to;
  return _react2.default.createElement(_index.EnvConsumer, null, function(env) {
    var h = Object.assign({}, headers, { Location: to });
    var response = env.response;

    response.writeHead(status, h);
    response.end();
  });
};

exports.default = Redirect;
