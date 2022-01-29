'use strict';
const child_process = require('child_process');
const assert = require('assert');
const proc = child_process.spawn(process.execPath, ['-i']);
proc.on('error', common.mustNotCall());
proc.on('exit', common.mustCall((code) => {
  assert.strictEqual(code, 0);
}));
proc.stdin.write('clearImmediate({});\n.exit\n');
