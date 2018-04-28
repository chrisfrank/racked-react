'use strict';

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _index = require('../index');

var _renderHeaders = require('./renderHeaders');

var _renderHeaders2 = _interopRequireDefault(_renderHeaders);

var _renderBody = require('./renderBody');

var _renderBody2 = _interopRequireDefault(_renderBody);

function _interopRequireDefault(obj) {
  return obj && obj.__esModule ? obj : { default: obj };
}

var Response = function Response(_ref) {
  var status = _ref.status,
    headers = _ref.headers,
    body = _ref.body,
    children = _ref.children,
    prefix = _ref.prefix,
    suffix = _ref.suffix,
    json = _ref.json;
  return _react2.default.createElement(_index.EnvConsumer, null, function(env) {
    var request = env.request,
      response = env.response;

    var head = (0, _renderHeaders2.default)({
      request: request,
      custom: headers,
      json: json,
    });
    response.writeHead(status, head);
    if (prefix) response.write(prefix);
    response.write(
      (0, _renderBody2.default)({
        body: body,
        children: children,
        json: json,
        format: head['Content-Type'],
      })
    );
    return response.end(suffix);
  });
};

Response.defaultProps = {
  status: 200,
  headers: {},
  body: '',
};

module.exports = Response;
