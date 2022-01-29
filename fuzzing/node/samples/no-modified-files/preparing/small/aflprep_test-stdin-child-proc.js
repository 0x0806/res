'use strict';
const assert = require('assert');
const child_process = require('child_process');
const path = require('path');
const cp = child_process.spawn(
  process.execPath,
  [path.resolve(__dirname, 'test-stdin-pause-resume.js')]
);
cp.on('exit', common.mustCall((code) => {
  assert.strictEqual(code, 0);
}));
