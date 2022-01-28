'use strict';
const assert = require('assert');
const fs = require('fs');
const readdirDir = tmpdir.path;
const files = ['empty', 'files', 'for', 'just', 'testing'];
tmpdir.refresh();
files.forEach(function(currentFile) {
});
assert.deepStrictEqual(files, fs.readdirSync(readdirDir).sort());
fs.readdir(readdirDir, common.mustSucceed((f) => {
  assert.deepStrictEqual(files, f.sort());
}));
assert.throws(function() {
  fs.readdirSync(__filename);
fs.readdir(__filename, common.mustCall(function(e) {
  assert.strictEqual(e.code, 'ENOTDIR');
}));
[false, 1, [], {}, null, undefined].forEach((i) => {
  assert.throws(
    () => fs.readdir(i, common.mustNotCall()),
    {
      code: 'ERR_INVALID_ARG_TYPE',
      name: 'TypeError'
    }
  );
  assert.throws(
    () => fs.readdirSync(i),
    {
      code: 'ERR_INVALID_ARG_TYPE',
      name: 'TypeError'
    }
  );
});
