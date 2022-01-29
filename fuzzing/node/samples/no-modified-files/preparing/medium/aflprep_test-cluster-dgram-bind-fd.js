'use strict';
if (common.isWindows)
  common.skip('dgram clustering is currently not supported on Windows.');
const NUM_WORKERS = 4;
const PACKETS_PER_WORKER = 10;
const assert = require('assert');
const cluster = require('cluster');
const dgram = require('dgram');
if (cluster.isPrimary)
  primary();
else
  worker();
function primary() {
  const { UDP } = internalBinding('udp_wrap');
  const rawHandle = new UDP();
  const err = rawHandle.bind(common.localhostIPv4, 0, 0);
  assert(err >= 0, String(err));
  assert.notStrictEqual(rawHandle.fd, -1);
  const fd = rawHandle.fd;
  let listening = 0;
  for (let i = 0; i < NUM_WORKERS; i++)
    cluster.fork();
  cluster.on('listening', common.mustCall((worker, address) => {
    if (++listening < NUM_WORKERS)
      return;
    const buf = Buffer.from('hello world');
    const socket = dgram.createSocket('udp4');
    let sent = 0;
    doSend();
    function doSend() {
      socket.send(buf, 0, buf.length, address.port, address.address, afterSend);
    }
    function afterSend() {
      sent++;
      if (sent < NUM_WORKERS * PACKETS_PER_WORKER) {
        doSend();
      } else {
        socket.close();
      }
    }
  }, NUM_WORKERS));
  for (const key in cluster.workers) {
    if (cluster.workers.hasOwnProperty(key))
      setupWorker(cluster.workers[key]);
  }
  function setupWorker(worker) {
    let received = 0;
    worker.send({
      fd,
    });
    worker.on('message', common.mustCall((msg) => {
      received = msg.received;
      worker.disconnect();
    }));
    worker.on('exit', common.mustCall(() => {
      assert.strictEqual(received, PACKETS_PER_WORKER);
    }));
  }
}
function worker() {
  let received = 0;
  process.on('message', common.mustCall((data) => {
    const { fd } = data;
    const socket = dgram.createSocket('udp4');
    socket.on('message', common.mustCall((data, info) => {
      received++;
      if (received === PACKETS_PER_WORKER) {
        process.send({ received });
        socket.close();
      }
    }, PACKETS_PER_WORKER));
    socket.bind({
      fd,
    });
  }));
}
