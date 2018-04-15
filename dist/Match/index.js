'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true,
});
exports.Endpoint = exports.Branch = undefined;

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _utils = require('./utils');

var _index = require('../index');

function _interopRequireDefault(obj) {
  return obj && obj.__esModule ? obj : { default: obj };
}

var Match = function Match(_ref) {
  var path = _ref.path,
    children = _ref.children,
    _ref$config = _ref.config,
    config = _ref$config === undefined ? {} : _ref$config;
  return _react2.default.createElement(_index.EnvConsumer, null, function(env) {
    // Return null if another branch has claimed the request
    if (env._rack_branch) return null;

    // Return null if a method prop was passed and doesn't match
    if (!(0, _utils.matchMethod)(env, config.method)) return null;

    // Easy cases handled! Run the full match fn
    var branch = (0, _utils.matchBranch)(path, env, config);

    return branch
      ? Next({ env: env, branch: branch, children: children })
      : null;
  });
};

var Next = function Next(_ref2) {
  var env = _ref2.env,
    branch = _ref2.branch,
    children = _ref2.children;

  // CLONE env for future modification by children
  var nextEnv = Object.assign({}, env, {
    branch: Object.assign({}, branch),
  });
  // MODIFY env to claim this branch request from siblings
  env._rack_branch = branch;

  // return children with cloned env in Context
  return _react2.default.createElement(
    _index.EnvProvider,
    { value: nextEnv },
    typeof children === 'function' ? children(nextEnv) : children
  );
};

var Branch = (exports.Branch = function Branch(_ref3) {
  var path = _ref3.path,
    children = _ref3.children;
  return _react2.default.createElement(Match, {
    path: path,
    children: children,
    config: { end: false },
  });
});

var Endpoint = (exports.Endpoint = function Endpoint(_ref4) {
  var path = _ref4.path,
    children = _ref4.children,
    method = _ref4.method;
  return _react2.default.createElement(Match, {
    path: path,
    children: children,
    config: { end: true, method: method },
  });
});
