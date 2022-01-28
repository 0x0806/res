'use strict';
const assert = require('assert');
const fs = require('fs');
const path = require('path');
if (!common.isWindows)
  common.skip('This test is for Windows only.');
tmpdir.refresh();
const DATA_VALUE = 'hello';
const RESERVED_CHARACTERS = '<>"|?*';
[...RESERVED_CHARACTERS].forEach((ch) => {
  const pathname = path.join(tmpdir.path, `somefile_${ch}`);
  assert.throws(
    () => {
      fs.writeFileSync(pathname, DATA_VALUE);
    },
    `failed with '${ch}'`);
});
const pathname = path.join(tmpdir.path, 'foo:bar');
fs.writeFileSync(pathname, DATA_VALUE);
let content = '';
const fileDataStream = fs.createReadStream(pathname, {
  encoding: 'utf8'
});
fileDataStream.on('data', (data) => {
  content += data;
});
fileDataStream.on('end', common.mustCall(() => {
  assert.strictEqual(content, DATA_VALUE);
}));
