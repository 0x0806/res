'use strict';
const assert = require('assert');
const cp = require('child_process');
const child = cp.spawnSync(
  process.execPath,
  ['--unhandled-rejections=foobar', __filename]
);
assert.strictEqual(child.stdout.toString(), '');
assert(child.stderr.includes(
  'invalid value for --unhandled-rejections'), child.stderr);
