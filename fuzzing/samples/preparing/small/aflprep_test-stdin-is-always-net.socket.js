'use strict';
const assert = require('assert');
const spawn = require('child_process').spawn;
const net = require('net');
if (process.argv[2] === 'child') {
  assert(process.stdin instanceof net.Socket);
  return;
}
const proc = spawn(
  process.execPath,
  [__filename, 'child'],
  { stdio: 'ignore' }
);
proc.on('exit', common.mustCall(function(exitCode) {
  assert.strictEqual(exitCode, 0);
}));
