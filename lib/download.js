"use strict";

var _promise = require("babel-runtime/core-js/promise");

var _promise2 = _interopRequireDefault(_promise);

var _downloadGitRepo = require("download-git-repo");

var _downloadGitRepo2 = _interopRequireDefault(_downloadGitRepo);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

module.exports = (repository, dir) => {
  return new _promise2.default((resolve, reject) => {
    (0, _downloadGitRepo2.default)(repository, dir, err => {
      if (err) {
        reject("Download is failed");
        return;
      }
      resolve();
    });
  });
};