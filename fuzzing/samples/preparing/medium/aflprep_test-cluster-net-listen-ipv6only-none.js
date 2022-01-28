'use strict';
if (!common.hasIPv6)
  common.skip('no IPv6 support');
const assert = require('assert');
const cluster = require('cluster');
const net = require('net');
cluster.schedulingPolicy = cluster.SCHED_NONE;
const host = '::';
const WORKER_ACCOUNT = 3;
if (cluster.isPrimary) {
  const workers = [];
  for (let i = 0; i < WORKER_ACCOUNT; i += 1) {
    const myWorker = new Promise((resolve) => {
      const worker = cluster.fork().on('exit', common.mustCall((statusCode) => {
        assert.strictEqual(statusCode, 0);
      })).on('listening', common.mustCall((workerAddress) => {
        assert.strictEqual(workerAddress.addressType, 6);
        assert.strictEqual(workerAddress.address, host);
        assert.strictEqual(workerAddress.port, common.PORT);
        resolve(worker);
      }));
    });
    workers.push(myWorker);
  }
  Promise.all(workers).then(common.mustCall((resolvedWorkers) => {
    const server = net.createServer().listen({
      host: '0.0.0.0',
      port: common.PORT,
    }, common.mustCall(() => {
      server.close();
      resolvedWorkers.forEach((resolvedWorker) => {
        resolvedWorker.disconnect();
      });
    }));
  }));
} else {
  net.createServer().listen({
    host,
    port: common.PORT,
    ipv6Only: true,
  }, common.mustCall());
}
