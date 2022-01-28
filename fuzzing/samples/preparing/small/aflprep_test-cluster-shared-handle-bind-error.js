'use strict';
const assert = require('assert');
const cluster = require('cluster');
const net = require('net');
if (cluster.isPrimary) {
  cluster.schedulingPolicy = cluster.SCHED_NONE;
  const server = net.createServer(common.mustNotCall());
  server.listen(0, common.mustCall(() => {
    const worker = cluster.fork({ PORT: server.address().port });
    worker.on('exit', common.mustCall((exitCode) => {
      assert.strictEqual(exitCode, 0);
      server.close();
    }));
  }));
} else {
  assert(process.env.PORT);
  const s = net.createServer(common.mustNotCall());
  s.listen(process.env.PORT, common.mustNotCall('listen should have failed'));
  s.on('error', common.mustCall((err) => {
    assert.strictEqual(err.code, 'EADDRINUSE');
    process.disconnect();
  }));
}
