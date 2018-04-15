'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true,
});
exports.Consumer = exports.Provider = undefined;

var _react = require('react');

var Environment = (0, _react.createContext)();
var Provider = Environment.Provider,
  Consumer = Environment.Consumer;
exports.default = Environment;
exports.Provider = Provider;
exports.Consumer = Consumer;
