'use strict';
common.skipIfInspectorDisabled();
common.skipIfWorker();
const assert = require('assert');
const cluster = require('cluster');
function serialFork() {
  return new Promise((res) => {
    const worker = cluster.fork();
    worker.on('exit', common.mustCall((code, signal) => {
      if (code !== 0 && code !== 12)
        assert.fail(`code: ${code}, signal: ${signal}`);
      const port = worker.process.spawnargs
        .filter((p) => p)
        .pop();
      res(Number(port));
    }));
  });
}
if (cluster.isPrimary) {
  Promise.all([serialFork(), serialFork(), serialFork()])
    .then(common.mustCall((ports) => {
      ports.splice(0, 0, process.debugPort);
      assert.strictEqual(ports.length, 4);
      assert(ports.every((port) => port > 0));
      assert(ports.every((port) => port < 65536));
      assert.strictEqual(ports[0] === 65535 ? 1024 : ports[0] + 1, ports[1]);
      assert.strictEqual(ports[1] === 65535 ? 1024 : ports[1] + 1, ports[2]);
      assert.strictEqual(ports[2] === 65535 ? 1024 : ports[2] + 1, ports[3]);
    }))
    .catch(
      (err) => {
        console.error(err);
        process.exit(1);
      });
} else {
  process.exit(0);
}
