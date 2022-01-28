'use strict';
const fs = require('fs');
if (process.argv[2] !== 'child') {
  const assert = require('assert');
  const { fork } = require('child_process');
  tmpdir.refresh();
  const child = fork(__filename, ['child'], { stdio: 'inherit' });
  child.on('exit', common.mustCall(function(code) {
    assert.strictEqual(code, 0);
  }));
  return;
}
common.expectWarning(
  'DeprecationWarning',
  'WriteStream.prototype.open() is deprecated', 'DEP0135');
s.open();
process.nextTick(() => {
  fs.WriteStream.prototype.open = common.mustCall();
  fs.createWriteStream('asd');
});
