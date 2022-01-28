'use strict';
const assert = require('assert');
const spawn = require('child_process').spawnSync;
if (process.features.inspector) {
  requiresArgument('--inspect-port');
  requiresArgument('--inspect-port=');
  requiresArgument('--debug-port');
  requiresArgument('--debug-port=');
}
requiresArgument('--eval');
function requiresArgument(option) {
  const r = spawn(process.execPath, [option], { encoding: 'utf8' });
  assert.strictEqual(r.status, 9);
  assert.strictEqual(
    msg,
    `${process.execPath}: ${option} requires an argument`
  );
}
