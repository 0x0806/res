'use strict';
const assert = require('assert');
const { spawnSync } = require('child_process');
const child = spawnSync(process.execPath, [
  '--require',
  path('monkey-patch-run-main.js'),
  path('semicolon.js'),
]);
assert.strictEqual(child.status, 0);
assert(child.stdout.toString().includes('runMain is monkey patched!'));
