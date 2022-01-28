'use strict';
if (process.argv[2] === 'child') {
  try {
  } catch (anException) {
    anException.binding.createExternal();
  }
  let gcCount = 10;
  (function gcLoop() {
    global.gc();
    if (--gcCount > 0) {
      setImmediate(() => gcLoop());
    }
  })();
  return;
}
const assert = require('assert');
const { spawnSync } = require('child_process');
const child = spawnSync(process.execPath, [
  '--expose-gc', __filename, 'child',
]);
assert.strictEqual(child.signal, null);
