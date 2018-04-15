'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true,
});
exports.matchMethod = exports.expandPath = exports.matchBranch = undefined;

var _url = require('url');

var _url2 = _interopRequireDefault(_url);

var _pathToRegexp = require('path-to-regexp');

var _pathToRegexp2 = _interopRequireDefault(_pathToRegexp);

function _interopRequireDefault(obj) {
  return obj && obj.__esModule ? obj : { default: obj };
}

// attempt to parse URL into a new route branch, and return null on failure
var matchBranch = (exports.matchBranch = function matchBranch() {
  var path =
    arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';
  var env = arguments[1];
  var options =
    arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};

  var keys = [];
  var fullPath = expandPath(env.branch.path, path);

  var _url$parse = _url2.default.parse(env.request.url),
    pathname = _url$parse.pathname;

  var match = (0, _pathToRegexp2.default)(fullPath, keys, options).exec(
    pathname
  );
  if (!match) return null;

  var params = keys.reduce(function(memo, key, index) {
    var val = match[index + 1];
    if (val !== undefined) memo[key.name] = val;
    return memo;
  }, env.branch.params || {});

  return { params: params, path: fullPath };
});

var expandPath = (exports.expandPath = function expandPath() {
  var prefix =
    arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';
  var suffix =
    arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : '';
  return prefix.concat(suffix);
});

var matchMethod = (exports.matchMethod = function matchMethod(env, method) {
  return !method || method.toUpperCase() === env.request.method;
});
