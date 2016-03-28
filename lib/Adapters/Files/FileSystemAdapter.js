'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.FileSystemAdapter = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _FilesAdapter2 = require('./FilesAdapter');

var _colors = require('colors');

var _colors2 = _interopRequireDefault(_colors);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } // FileSystemAdapter
//
// Stores files in local file system
// Requires write access to the server's file system.

var fs = require('fs');
var path = require('path');
var pathSep = require('path').sep;

var FileSystemAdapter = exports.FileSystemAdapter = function (_FilesAdapter) {
  _inherits(FileSystemAdapter, _FilesAdapter);

  function FileSystemAdapter() {
    var _ref = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

    var _ref$filesSubDirector = _ref.filesSubDirectory;
    var filesSubDirectory = _ref$filesSubDirector === undefined ? '' : _ref$filesSubDirector;

    _classCallCheck(this, FileSystemAdapter);

    var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(FileSystemAdapter).call(this));

    _this._filesDir = filesSubDirectory;
    _this._mkdir(_this._getApplicationDir());
    if (!_this._applicationDirExist()) {
      throw "Files directory doesn't exist.";
    }
    return _this;
  }

  // For a given config object, filename, and data, store a file
  // Returns a promise


  _createClass(FileSystemAdapter, [{
    key: 'createFile',
    value: function createFile(config, filename, data) {
      var _this2 = this;

      return new Promise(function (resolve, reject) {
        var filepath = _this2._getLocalFilePath(filename);
        fs.writeFile(filepath, data, function (err) {
          if (err !== null) {
            return reject(err);
          }
          resolve(data);
        });
      });
    }
  }, {
    key: 'deleteFile',
    value: function deleteFile(config, filename) {
      var _this3 = this;

      return new Promise(function (resolve, reject) {
        var filepath = _this3._getLocalFilePath(filename);
        fs.readFile(filepath, function (err, data) {
          if (err !== null) {
            return reject(err);
          }
          fs.unlink(filepath, function (unlinkErr) {
            if (err !== null) {
              return reject(unlinkErr);
            }
            resolve(data);
          });
        });
      });
    }
  }, {
    key: 'getFileData',
    value: function getFileData(config, filename) {
      var _this4 = this;

      return new Promise(function (resolve, reject) {
        var filepath = _this4._getLocalFilePath(filename);
        fs.readFile(filepath, function (err, data) {
          if (err !== null) {
            return reject(err);
          }
          resolve(data);
        });
      });
    }
  }, {
    key: 'getFileLocation',
    value: function getFileLocation(config, filename) {
      return config.mount + '/' + this._getLocalFilePath(filename);
    }

    /*
      Helpers
     --------------- */

  }, {
    key: '_getApplicationDir',
    value: function _getApplicationDir() {
      if (this._filesDir) {
        return path.join('files', this._filesDir);
      } else {
        return 'files';
      }
    }
  }, {
    key: '_applicationDirExist',
    value: function _applicationDirExist() {
      return fs.existsSync(this._getApplicationDir());
    }
  }, {
    key: '_getLocalFilePath',
    value: function _getLocalFilePath(filename) {
      var applicationDir = this._getApplicationDir();
      if (!fs.existsSync(applicationDir)) {
        this._mkdir(applicationDir);
      }
      return path.join(applicationDir, encodeURIComponent(filename));
    }
  }, {
    key: '_mkdir',
    value: function _mkdir(dirPath) {
      // snippet found on -> https://gist.github.com/danherbert-epam/3960169
      var dirs = dirPath.split(pathSep);
      var root = "";

      while (dirs.length > 0) {
        var dir = dirs.shift();
        if (dir === "") {
          // If directory starts with a /, the first path will be an empty string.
          root = pathSep;
        }
        if (!fs.existsSync(path.join(root, dir))) {
          try {
            fs.mkdirSync(path.join(root, dir));
          } catch (e) {
            if (e.code == 'EACCES') {
              throw new Error("PERMISSION ERROR: In order to use the FileSystemAdapter, write access to the server's file system is required.");
            }
          }
        }
        root = path.join(root, dir, pathSep);
      }
    }
  }]);

  return FileSystemAdapter;
}(_FilesAdapter2.FilesAdapter);

exports.default = FileSystemAdapter;