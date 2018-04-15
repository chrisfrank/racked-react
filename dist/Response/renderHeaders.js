'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true,
});
var defaults = function defaults(_ref) {
  var request = _ref.request,
    json = _ref.json;
  var headers = request.headers;

  return {
    'Content-Type': json
      ? 'application/json; charset=utf-8'
      : headers.accept ? headers.accept.split(',')[0] : 'text/plain',
  };
};

var renderHeaders = function renderHeaders(_ref2) {
  var request = _ref2.request,
    _ref2$custom = _ref2.custom,
    custom = _ref2$custom === undefined ? {} : _ref2$custom,
    json = _ref2.json;
  return Object.assign({}, defaults({ request: request, json: json }), custom);
};

exports.default = renderHeaders;
