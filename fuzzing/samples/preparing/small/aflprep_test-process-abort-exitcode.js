'use strict';
const assert = require('assert');
const spawn = require('child_process').spawn;
if (process.argv[2] === 'child') {
  process.abort();
} else {
  const child = spawn(process.execPath, [__filename, 'child']);
  child.on('exit', common.mustCall((code, signal) => {
    if (common.isWindows) {
      assert.strictEqual(code, 134);
      assert.strictEqual(signal, null);
    } else {
      assert.strictEqual(code, null);
      assert.strictEqual(signal, 'SIGABRT');
    }
  }));
}
