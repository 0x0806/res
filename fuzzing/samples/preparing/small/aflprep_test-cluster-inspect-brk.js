'use strict';
common.skipIfInspectorDisabled();
const assert = require('assert');
const cluster = require('cluster');
const debuggerPort = common.PORT;
if (cluster.isPrimary) {
  function test(execArgv) {
    cluster.setupPrimary({
      execArgv: execArgv,
      stdio: ['pipe', 'pipe', 'pipe', 'ipc', 'pipe']
    });
    const worker = cluster.fork();
    worker.process.stderr.once('data', common.mustCall(function() {
      worker.process.kill('SIGTERM');
    }));
    worker.process.on('exit', common.mustCall(function(code, signal) {
      assert.strictEqual(signal, 'SIGTERM');
    }));
  }
  test(['--inspect-brk']);
  test([`--inspect-brk=${debuggerPort}`]);
} else {
  assert.fail('Test failed: cluster worker should be at a breakpoint.');
}
