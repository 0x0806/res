'use strict';
const assert = require('assert');
const cp = require('child_process');
if (process.argv[2] === 'child') {
  console.log(process.argv0);
  return;
}
const noArgv0 = cp.spawnSync(process.execPath, [__filename, 'child']);
assert.strictEqual(noArgv0.stdout.toString().trim(), process.execPath);
const withArgv0 = cp.spawnSync(process.execPath, [__filename, 'child'],
                               { argv0: 'withArgv0' });
assert.strictEqual(withArgv0.stdout.toString().trim(), 'withArgv0');
