'use strict';
const assert = require('assert');
const fs = require('fs');
const path = require('path');
const fileName = path.resolve(tmpdir.path, 'test.bin');
const buf = Buffer.alloc(512 * 1024, 42);
tmpdir.refresh();
fs.writeFileSync(fileName, buf);
fs.readFile(fileName, common.mustSucceed((data) => {
  assert.strictEqual(data.length, buf.length);
  assert.strictEqual(buf[0], 42);
  fs.unlinkSync(fileName);
}));
