'use strict';
const assert = require('assert');
const child_process = require('child_process');
if (process.argv[2] === 'child') {
  test_fatal.TestStringLength();
  return;
}
const p = child_process.spawnSync(
  process.execPath, [ '--napi-modules', __filename, 'child' ]);
assert.ifError(p.error);
assert.ok(p.stderr.toString().includes(
  'FATAL ERROR: test_fatal::Test fatal message'));
assert.ok(p.status === 134 || p.signal === 'SIGABRT');
