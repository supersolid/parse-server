'use strict';

var LogLevel = {
  'VERBOSE': 0,
  'DEBUG': 1,
  'INFO': 2,
  'ERROR': 3,
  'NONE': 4
};

function getCurrentLogLevel() {
  if (PLog.logLevel && PLog.logLevel in LogLevel) {
    return LogLevel[PLog.logLevel];
  }
  return LogLevel['ERROR'];
}

function verbose() {
  if (getCurrentLogLevel() <= LogLevel['VERBOSE']) {
    console.log.apply(console, arguments);
  }
}

function log() {
  if (getCurrentLogLevel() <= LogLevel['INFO']) {
    console.log.apply(console, arguments);
  }
}

function error() {
  if (getCurrentLogLevel() <= LogLevel['ERROR']) {
    console.error.apply(console, arguments);
  }
}

var PLog = {
  log: log,
  error: error,
  verbose: verbose,
  logLevel: 'INFO'
};

module.exports = PLog;