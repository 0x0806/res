'use strict';
const assert = require('assert');
const path = require('path');
const childProcess = require('child_process');
const fs = require('fs');
const scriptString = fixtures.path('print-chars.js');
const scriptBuffer = fixtures.path('print-chars-from-buffer.js');
const tmpFile = path.join(tmpdir.path, 'stdout.txt');
tmpdir.refresh();
function test(size, useBuffer, cb) {
  const cmd = `"${process.argv[0]}" "${
    useBuffer ? scriptBuffer : scriptString}" ${size} > "${tmpFile}"`;
  try {
    fs.unlinkSync(tmpFile);
  } catch {}
  console.log(`${size} chars to ${tmpFile}...`);
  childProcess.exec(cmd, common.mustSucceed(() => {
    console.log('done!');
    const stat = fs.statSync(tmpFile);
    console.log(`${tmpFile} has ${stat.size} bytes`);
    assert.strictEqual(size, stat.size);
    fs.unlinkSync(tmpFile);
    cb();
  }));
}
test(1024 * 1024, false, common.mustCall(function() {
  console.log('Done printing with string');
  test(1024 * 1024, true, common.mustCall(function() {
    console.log('Done printing with buffer');
  }));
}));
