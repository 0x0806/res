'use strict';
const assert = require('assert');
const fs = require('fs');
const path = require('path');
const enoentFile = path.join(tmpdir.path, 'non-existent-file');
const expectedStatObject = new BigIntStats(
);
tmpdir.refresh();
let fileExists = false;
const options = { interval: 0, bigint: true };
const watcher =
  fs.watchFile(enoentFile, options, common.mustCall((curr, prev) => {
    if (!fileExists) {
      assert.deepStrictEqual(curr, expectedStatObject);
      assert.deepStrictEqual(prev, expectedStatObject);
      fs.closeSync(fs.openSync(enoentFile, 'w'));
      fileExists = true;
    } else {
      assert(curr.ino > 0n);
      assert(prev.ino <= 0n);
      fs.unwatchFile(enoentFile);
    }
  }, 2));
watcher.on('stop', common.mustCall(function onStop() {}));
