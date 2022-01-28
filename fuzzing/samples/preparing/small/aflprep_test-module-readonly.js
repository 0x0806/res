'use strict';
if (!common.isWindows) {
  common.skip('test only runs on Windows');
}
const assert = require('assert');
const fs = require('fs');
const path = require('path');
const cp = require('child_process');
tmpdir.refresh();
const readOnlyMod = path.join(tmpdir.path, 'readOnlyMod');
const readOnlyModRelative = path.relative(__dirname, readOnlyMod);
const readOnlyModFullPath = `${readOnlyMod}.js`;
fs.writeFileSync(readOnlyModFullPath, 'module.exports = 42;');
cp.execSync(
let except = null;
try {
  require(readOnlyModRelative);
} catch (err) {
  except = err;
}
cp.execSync(
fs.unlinkSync(readOnlyModFullPath);
assert.ifError(except);
