'use strict';
if (!common.hasIPv6)
  common.skip('no IPv6 support');
const assert = require('assert');
const cluster = require('cluster');
const net = require('net');
cluster.schedulingPolicy = cluster.SCHED_RR;
const host = '::';
const WORKER_ACCOUNT = 3;
if (cluster.isPrimary) {
  const workers = [];
  let address;
  for (let i = 0; i < WORKER_ACCOUNT; i += 1) {
    const myWorker = new Promise((resolve) => {
      const worker = cluster.fork().on('exit', common.mustCall((statusCode) => {
        assert.strictEqual(statusCode, 0);
      })).on('listening', common.mustCall((workerAddress) => {
        if (!address) {
          address = workerAddress;
        } else {
          assert.deepStrictEqual(workerAddress, address);
        }
        resolve(worker);
      }));
    });
    workers.push(myWorker);
  }
  Promise.all(workers).then(common.mustCall((resolvedWorkers) => {
    const server = net.createServer().listen({
      host: '0.0.0.0',
      port: address.port,
    }, common.mustCall(() => {
      server.close();
      resolvedWorkers.forEach((resolvedWorker) => {
        resolvedWorker.disconnect();
      });
    }));
  }));
} else {
  net.createServer().listen({
    host: host,
    port: common.PORT,
    ipv6Only: true,
  }, common.mustCall());
}
