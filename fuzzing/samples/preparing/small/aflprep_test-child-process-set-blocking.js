'use strict';
const assert = require('assert');
const ch = require('child_process');
const SIZE = 100000;
const python = process.env.PYTHON || 'python';
const cp = ch.spawn(python, ['-c', `print(${SIZE} * "C")`], {
  stdio: 'inherit'
});
cp.on('exit', common.mustCall(function(code) {
  assert.strictEqual(code, 0);
}));
