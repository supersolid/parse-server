'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.logger = undefined;
exports.configureLogger = configureLogger;
exports.addGroup = addGroup;

var _winston = require('winston');

var _winston2 = _interopRequireDefault(_winston);

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _winstonDailyRotateFile = require('winston-daily-rotate-file');

var _winstonDailyRotateFile2 = _interopRequireDefault(_winstonDailyRotateFile);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var LOGS_FOLDER = './logs/';

if (typeof process !== 'undefined' && process.env.NODE_ENV === 'test') {
  LOGS_FOLDER = './test_logs/';
}

var currentLogsFolder = LOGS_FOLDER;
var currentTransports;

var logger = new _winston2.default.Logger();

function configureLogger(_ref) {
  var logsFolder = _ref.logsFolder;

  logsFolder = logsFolder || currentLogsFolder;

  if (!_path2.default.isAbsolute(logsFolder)) {
    logsFolder = _path2.default.resolve(process.cwd(), logsFolder);
  }
  if (!_fs2.default.existsSync(logsFolder)) {
    _fs2.default.mkdirSync(logsFolder);
  }
  currentLogsFolder = logsFolder;

  currentTransports = [new _winston2.default.transports.Console({
    colorize: true,
    level: process.env.VERBOSE ? 'verbose' : 'info'
  }), new _winstonDailyRotateFile2.default({
    filename: 'parse-server.info',
    dirname: currentLogsFolder,
    name: 'parse-server',
    level: process.env.VERBOSE ? 'verbose' : 'info'
  }), new _winstonDailyRotateFile2.default({
    filename: 'parse-server.err',
    dirname: currentLogsFolder,
    name: 'parse-server-error',
    level: 'error'
  })];

  logger.configure({
    transports: currentTransports
  });
}

configureLogger({ logsFolder: LOGS_FOLDER });

function addGroup(groupName) {
  var level = process.env.VERBOSE ? 'verbose' : 'info';
  _winston2.default.loggers.add(groupName, {
    transports: [new _winston2.default.transports.Console({
      colorize: true,
      level: level
    }), new _winstonDailyRotateFile2.default({
      filename: groupName,
      dirname: currentLogsFolder,
      name: groupName,
      level: level
    }), new _winstonDailyRotateFile2.default({
      filename: 'parse-server.info',
      name: 'parse-server',
      dirname: currentLogsFolder,
      level: level
    }), new _winstonDailyRotateFile2.default({
      filename: 'parse-server.err',
      dirname: currentLogsFolder,
      name: 'parse-server-error',
      level: 'error'
    })]
  });
  return _winston2.default.loggers.get(groupName);
}

exports.logger = logger;
exports.default = _winston2.default;