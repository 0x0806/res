'use strict';
const assert = require('assert');
const { spawn } = require('child_process');
const child = spawn(process.execPath, [native]);
child.on('exit', (code) => {
  assert.strictEqual(code, 1);
});
