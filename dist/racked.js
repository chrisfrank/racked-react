'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true,
});

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _server = require('react-dom/server');

var _reactRouter = require('react-router');

var _index = require('./index');

function _interopRequireDefault(obj) {
  return obj && obj.__esModule ? obj : { default: obj };
}

// wrap an App component in a node/http-compatible function
// default server is node/http, but it works with express, etc
var racked = function racked(App) {
  return function(request, response) {
    return _rack_render({
      _rack_app: App,
      _rack_store: [],
      request: request,
      response: response,
    });
  };
};

// render the racked App, passing this fn itself down as a render
// prop, so that components down the chain can instantiate Promises
// and re-call render with the promise results
var _rack_render = function _rack_render(props) {
  var env = Object.assign({}, props, {
    _rack_render: _rack_render,
    _rack_holds: 0,
    _rack_branch: null,
    branch: {},
  });
  (0, _server.renderToString)(
    _react2.default.createElement(_index.EnvProvider, {
      value: env,
      children: _react2.default.createElement(env._rack_app, env),
    })
  );
};

exports.default = racked;
