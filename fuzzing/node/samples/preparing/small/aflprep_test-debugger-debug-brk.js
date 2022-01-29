'use strict';
common.skipIfInspectorDisabled();
const assert = require('assert');
const { spawnSync } = require('child_process');
const script = fixtures.path('empty.js');
function test(arg) {
  const child = spawnSync(process.execPath, ['--inspect', arg, script]);
  const stderr = child.stderr.toString();
  assert(stderr.includes('DEP0062'));
  assert.strictEqual(child.status, 9);
}
test('--debug-brk');
test('--debug-brk=5959');
