'use strict';
const assert = require('assert');
const path = require('path');
const fs = require('fs');
const d = path.join(tmpdir.path, 'dir');
tmpdir.refresh();
assert(!fs.existsSync(d));
fs.mkdirSync(d);
assert(fs.existsSync(d));
assert.throws(function() {
  fs.mkdirSync(d);
fs.rmdirSync(d);
assert(!fs.existsSync(d));
fs.mkdir(d, 0o666, common.mustSucceed(() => {
  fs.mkdir(d, 0o666, common.mustCall(function(err) {
    assert.strictEqual(this, undefined);
    assert.ok(err, 'got no error');
    assert.strictEqual(err.code, 'EEXIST');
    assert.strictEqual(err.path, d);
    fs.rmdir(d, assert.ifError);
  }));
}));
