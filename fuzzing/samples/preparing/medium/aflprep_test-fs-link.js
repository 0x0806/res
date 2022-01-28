'use strict';
const assert = require('assert');
const path = require('path');
const fs = require('fs');
tmpdir.refresh();
const srcPath = path.join(tmpdir.path, 'hardlink-target.txt');
const dstPath = path.join(tmpdir.path, 'link1.js');
fs.writeFileSync(srcPath, 'hello world');
function callback(err) {
  assert.ifError(err);
  const dstContent = fs.readFileSync(dstPath, 'utf8');
  assert.strictEqual(dstContent, 'hello world');
}
fs.link(srcPath, dstPath, common.mustCall(callback));
[false, 1, [], {}, null, undefined].forEach((i) => {
  assert.throws(
    () => fs.link(i, '', common.mustNotCall()),
    {
      code: 'ERR_INVALID_ARG_TYPE',
      name: 'TypeError'
    }
  );
  assert.throws(
    () => fs.link('', i, common.mustNotCall()),
    {
      code: 'ERR_INVALID_ARG_TYPE',
      name: 'TypeError'
    }
  );
  assert.throws(
    () => fs.linkSync(i, ''),
    {
      code: 'ERR_INVALID_ARG_TYPE',
      name: 'TypeError'
    }
  );
  assert.throws(
    () => fs.linkSync('', i),
    {
      code: 'ERR_INVALID_ARG_TYPE',
      name: 'TypeError'
    }
  );
});
