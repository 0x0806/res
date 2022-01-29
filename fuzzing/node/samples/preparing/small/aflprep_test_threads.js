'use strict';
const assert = require('assert');
const child_process = require('child_process');
if (process.argv[2] === 'child') {
  test_fatal.TestThread();
  while (true) {}
}
const p = child_process.spawnSync(
  process.execPath, [ __filename, 'child' ]);
assert.ifError(p.error);
assert.ok(p.stderr.toString().includes(
  'FATAL ERROR: work_thread foobar'));
assert.ok(p.status === 134 || p.signal === 'SIGABRT');
