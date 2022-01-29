'use strict';
const assert = require('assert');
if (common.isWindows)
  common.skip('Sending signals with process.kill is not supported on Windows');
if (!common.isMainThread)
  common.skip('No signal handling available in Workers');
process.once('SIGINT', common.mustCall((signal) => {
  assert.strictEqual(signal, 'SIGINT');
}));
process.kill(process.pid, 'SIGINT');
process.once('SIGTERM', common.mustCall((signal) => {
  assert.strictEqual(signal, 'SIGTERM');
}));
process.kill(process.pid, 'SIGTERM');
setImmediate(() => {});
