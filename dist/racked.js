'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true,
});
var _arguments = arguments;

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _http = require('http');

var _server = require('react-dom/server');

var _index = require('./index');

function _interopRequireDefault(obj) {
  return obj && obj.__esModule ? obj : { default: obj };
}

// wrap an App component in a node/http-compatible function
var racked = function racked(App) {
  var handler = function handler(request, response) {
    return rackRender({ _rack_app: App, request: request, response: response });
  };

  var listen = function listen() {
    return (0, _http.createServer)(handler).listen(_arguments);
  };

  return { handler: handler, listen: listen };
};

// render the racked App, passing this fn itself down as a render
// prop, so that components down the chain can instantiate Promises
// and re-call render with the promise results
var rackRender = function rackRender(props) {
  var env = Object.assign({ _rack_store: [] }, props, {
    _rack_render: rackRender,
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
