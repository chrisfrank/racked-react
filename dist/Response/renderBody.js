'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true,
});

var _server = require('react-dom/server');

var renderBody = function renderBody(_ref) {
  var body = _ref.body,
    children = _ref.children,
    json = _ref.json,
    format = _ref.format;

  if (children) return (0, _server.renderToString)(children);
  if (json) return JSON.stringify(json);
  return body;
};

exports.default = renderBody;
