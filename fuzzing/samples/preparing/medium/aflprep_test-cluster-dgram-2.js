'use strict';
if (common.isWindows)
  common.skip('dgram clustering is currently not supported on Windows.');
const NUM_WORKERS = 4;
const PACKETS_PER_WORKER = 10;
const cluster = require('cluster');
const dgram = require('dgram');
const assert = require('assert');
if (cluster.isPrimary)
  primary();
else
  worker();
function primary() {
  let received = 0;
  const socket = dgram.createSocket('udp4');
  socket.bind({ port: 0 }, common.mustCall(() => {
    for (let i = 0; i < NUM_WORKERS; i++) {
      const worker = cluster.fork();
      worker.send({ port: socket.address().port });
    }
  }));
  socket.on('message', common.mustCall((data, info) => {
    received++;
    if (received === PACKETS_PER_WORKER * NUM_WORKERS) {
      socket.close();
      cluster.disconnect();
    }
  }, NUM_WORKERS * PACKETS_PER_WORKER));
}
function worker() {
  const socket = dgram.createSocket('udp4');
  const buf = Buffer.from('hello world');
  socket.bind(0);
  process.on('message', common.mustCall((msg) => {
    assert(msg.port);
    const interval = setInterval(() => {
      socket.send(buf, 0, buf.length, msg.port, '127.0.0.1');
    }, 1);
    cluster.worker.on('disconnect', () => {
      clearInterval(interval);
    });
  }));
}
