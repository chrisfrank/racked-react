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

var next = function next(env, store) {
  return Object.assign({}, env, {
    _rack_holds: env._rack_holds + 1,
    _rack_store: store || env._rack_store,
  });
};

var handleError = function handleError(error, request, response) {
  response.writeHead(500, error);
  response.end();
};

var Hold = function Hold(_ref) {
  var until = _ref.until,
    children = _ref.children,
    _ref$onError = _ref.onError,
    onError = _ref$onError === undefined ? handleError : _ref$onError;
  return _react2.default.createElement(_index.EnvConsumer, null, function(env) {
    var _rack_holds = env._rack_holds,
      _rack_store = env._rack_store;

    var data = _rack_store[_rack_holds];
    if (data) return Next({ data: data, children: children, env: env });

    (typeof until === 'function' ? until() : until)
      .then(function(result) {
        if (!result) throw new Error('Hold returned ' + result);
        // copy the store to a new object
        var store = Object.assign({}, _rack_store);
        // store the promise result
        store[_rack_holds] = result;
        env._rack_render(next(env, store));
      })
      .catch(function(error) {
        onError(error, env.request, env.response);
      });

    return null;
  });
};

var Next = function Next(_ref2) {
  var data = _ref2.data,
    children = _ref2.children,
    env = _ref2.env;
  return _react2.default.createElement(_index.EnvProvider, {
    value: next(env),
    children: typeof children === 'function' ? children(data) : children,
  });
};

exports.default = Hold;
