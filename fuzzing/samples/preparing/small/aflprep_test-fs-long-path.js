'use strict';
if (!common.isWindows)
  common.skip('this test is Windows-specific.');
const fs = require('fs');
const path = require('path');
const fileNameLen = Math.max(260 - tmpdir.path.length - 1, 1);
const fileName = path.join(tmpdir.path, 'x'.repeat(fileNameLen));
const fullPath = path.resolve(fileName);
tmpdir.refresh();
console.log({
  filenameLength: fileName.length,
  fullPathLength: fullPath.length
});
fs.writeFile(fullPath, 'ok', common.mustSucceed(() => {
  fs.stat(fullPath, common.mustSucceed());
}));
