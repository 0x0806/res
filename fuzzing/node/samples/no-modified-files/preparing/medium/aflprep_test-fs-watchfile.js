'use strict';
const assert = require('assert');
const fs = require('fs');
const path = require('path');
assert.throws(
  () => {
  },
  {
    code: 'ERR_INVALID_ARG_TYPE',
    name: 'TypeError'
  });
assert.throws(
  () => {
  },
  {
    code: 'ERR_INVALID_ARG_TYPE',
    name: 'TypeError'
  });
assert.throws(() => {
  fs.watchFile(new Object(), common.mustNotCall());
}, { code: 'ERR_INVALID_ARG_TYPE', name: 'TypeError' });
const enoentFile = path.join(tmpdir.path, 'non-existent-file');
const expectedStatObject = new fs.Stats(
);
tmpdir.refresh();
let fileExists = false;
const watcher =
  fs.watchFile(enoentFile, { interval: 0 }, common.mustCall((curr, prev) => {
    if (!fileExists) {
      assert.deepStrictEqual(curr, expectedStatObject);
      assert.deepStrictEqual(prev, expectedStatObject);
      fs.closeSync(fs.openSync(enoentFile, 'w'));
      fileExists = true;
    } else {
      assert(curr.ino > 0);
      assert(prev.ino <= 0);
      fs.unwatchFile(enoentFile);
    }
  }, 2));
watcher.on('stop', common.mustCall(function onStop() {}));
if (common.isLinux || common.isOSX || common.isWindows) {
  const dir = path.join(tmpdir.path, 'watch');
  fs.mkdir(dir, common.mustCall(function(err) {
    if (err) assert.fail(err);
    fs.watch(dir, common.mustCall(function(eventType, filename) {
      clearInterval(interval);
      this._handle.close();
      assert.strictEqual(filename, 'foo.txt');
    }));
    const interval = setInterval(() => {
      fs.writeFile(path.join(dir, 'foo.txt'), 'foo', common.mustCall((err) => {
        if (err) assert.fail(err);
      }));
    }, 1);
  }));
}
