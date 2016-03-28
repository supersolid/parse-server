'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ParseServer = exports.FileSystemAdapter = exports.GCSAdapter = exports.S3Adapter = undefined;

var _ParseServer2 = require('./ParseServer');

var _ParseServer3 = _interopRequireDefault(_ParseServer2);

var _GCSAdapter = require('./Adapters/Files/GCSAdapter');

var _S3Adapter = require('./Adapters/Files/S3Adapter');

var _FileSystemAdapter = require('./Adapters/Files/FileSystemAdapter');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// Factory function
var _ParseServer = function _ParseServer(options) {
  var server = new _ParseServer3.default(options);
  return server.app;
};
// Mount the create liveQueryServer
_ParseServer.createLiveQueryServer = _ParseServer3.default.createLiveQueryServer;

exports.default = _ParseServer3.default;
exports.S3Adapter = _S3Adapter.S3Adapter;
exports.GCSAdapter = _GCSAdapter.GCSAdapter;
exports.FileSystemAdapter = _FileSystemAdapter.FileSystemAdapter;
exports.ParseServer = _ParseServer;