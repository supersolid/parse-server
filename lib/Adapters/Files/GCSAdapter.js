'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.GCSAdapter = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _gcloud = require('gcloud');

var _FilesAdapter2 = require('./FilesAdapter');

var _requiredParameter = require('../../requiredParameter');

var _requiredParameter2 = _interopRequireDefault(_requiredParameter);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } // GCSAdapter
// Store Parse Files in Google Cloud Storage: https://cloud.google.com/storage


function requiredOrFromEnvironment(env, name) {
  var environmentVariable = process.env[env];
  if (!environmentVariable) {
    (0, _requiredParameter2.default)('GCSAdapter requires an ' + name);
  }
  return environmentVariable;
}

function fromEnvironmentOrDefault(env, defaultValue) {
  var environmentVariable = process.env[env];
  if (environmentVariable) {
    return environmentVariable;
  }
  return defaultValue;
}

var GCSAdapter = exports.GCSAdapter = function (_FilesAdapter) {
  _inherits(GCSAdapter, _FilesAdapter);

  // GCS Project ID and the name of a corresponding Keyfile are required.
  // Unlike the S3 adapter, you must create a new Cloud Storage bucket, as this is not created automatically.
  // See https://googlecloudplatform.github.io/gcloud-node/#/docs/master/guides/authentication
  // for more details.

  function GCSAdapter() {
    var projectId = arguments.length <= 0 || arguments[0] === undefined ? requiredOrFromEnvironment('GCP_PROJECT_ID', 'projectId') : arguments[0];
    var keyFilename = arguments.length <= 1 || arguments[1] === undefined ? requiredOrFromEnvironment('GCP_KEYFILE_PATH', 'keyfile path') : arguments[1];
    var bucket = arguments.length <= 2 || arguments[2] === undefined ? requiredOrFromEnvironment('GCS_BUCKET', 'bucket name') : arguments[2];

    var _ref = arguments.length <= 3 || arguments[3] === undefined ? {} : arguments[3];

    var _ref$bucketPrefix = _ref.bucketPrefix;
    var bucketPrefix = _ref$bucketPrefix === undefined ? fromEnvironmentOrDefault('GCS_BUCKET_PREFIX', '') : _ref$bucketPrefix;
    var _ref$directAccess = _ref.directAccess;
    var directAccess = _ref$directAccess === undefined ? fromEnvironmentOrDefault('GCS_DIRECT_ACCESS', false) : _ref$directAccess;

    _classCallCheck(this, GCSAdapter);

    var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(GCSAdapter).call(this));

    _this._bucket = bucket;
    _this._bucketPrefix = bucketPrefix;
    _this._directAccess = directAccess;

    var options = {
      projectId: projectId,
      keyFilename: keyFilename
    };

    _this._gcsClient = new _gcloud.storage(options);
    return _this;
  }

  // For a given config object, filename, and data, store a file in GCS.
  // Resolves the promise or fails with an error.


  _createClass(GCSAdapter, [{
    key: 'createFile',
    value: function createFile(config, filename, data, contentType) {
      var _this2 = this;

      var params = {
        contentType: contentType || 'application/octet-stream'
      };

      return new Promise(function (resolve, reject) {
        var file = _this2._gcsClient.bucket(_this2._bucket).file(_this2._bucketPrefix + filename);
        // gcloud supports upload(file) not upload(bytes), so we need to stream.
        var uploadStream = file.createWriteStream(params);
        uploadStream.on('error', function (err) {
          return reject(err);
        }).on('finish', function () {
          // Second call to set public read ACL after object is uploaded.
          if (_this2._directAccess) {
            file.makePublic(function (err, res) {
              if (err !== null) {
                return reject(err);
              }
              resolve();
            });
          } else {
            resolve();
          }
        });
        uploadStream.write(data);
        uploadStream.end();
      });
    }

    // Deletes a file with the given file name.
    // Returns a promise that succeeds with the delete response, or fails with an error.

  }, {
    key: 'deleteFile',
    value: function deleteFile(config, filename) {
      var _this3 = this;

      return new Promise(function (resolve, reject) {
        var file = _this3._gcsClient.bucket(_this3._bucket).file(_this3._bucketPrefix + filename);
        file.delete(function (err, res) {
          if (err !== null) {
            return reject(err);
          }
          resolve(res);
        });
      });
    }

    // Search for and return a file if found by filename.
    // Returns a promise that succeeds with the buffer result from GCS, or fails with an error.

  }, {
    key: 'getFileData',
    value: function getFileData(config, filename) {
      var _this4 = this;

      return new Promise(function (resolve, reject) {
        var file = _this4._gcsClient.bucket(_this4._bucket).file(_this4._bucketPrefix + filename);
        // Check for existence, since gcloud-node seemed to be caching the result
        file.exists(function (err, exists) {
          if (exists) {
            file.download(function (err, data) {
              if (err !== null) {
                return reject(err);
              }
              return resolve(data);
            });
          } else {
            reject(err);
          }
        });
      });
    }

    // Generates and returns the location of a file stored in GCS for the given request and filename.
    // The location is the direct GCS link if the option is set,
    // otherwise we serve the file through parse-server.

  }, {
    key: 'getFileLocation',
    value: function getFileLocation(config, filename) {
      if (this._directAccess) {
        return 'https://' + this._bucket + '.storage.googleapis.com/' + (this._bucketPrefix + filename);
      }
      return config.mount + '/files/' + config.applicationId + '/' + encodeURIComponent(filename);
    }
  }]);

  return GCSAdapter;
}(_FilesAdapter2.FilesAdapter);

exports.default = GCSAdapter;