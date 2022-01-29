'use strict';
const assert = require('assert');
const cluster = require('cluster');
const dgram = require('dgram');
const BYE = 'bye';
if (cluster.isPrimary) {
  const worker1 = cluster.fork();
  worker1.on('error', (err) => {
    if (err.code === 'ENOTSUP') throw err;
  });
  worker1.on('message', (msg) => {
    if (typeof msg !== 'object') process.exit(0);
    if (msg.message !== 'success') process.exit(0);
    if (typeof msg.port1 !== 'number') process.exit(0);
    const worker2 = cluster.fork({ PRT1: msg.port1 });
    worker2.on('message', () => process.exit(0));
    worker2.on('exit', (code, signal) => {
      assert.strictEqual(code, 0);
      assert.strictEqual(signal, null);
    });
    process.on('exit', () => {
      worker1.send(BYE);
      worker2.send(BYE);
    });
  });
} else {
  process.on('message', (msg) => msg === BYE && process.exit(0));
  const PRT1 = process.env.PRT1 || 0;
  const socket1 = dgram.createSocket('udp4', () => {});
  socket1.on('error', PRT1 === 0 ? () => {} : assert.fail);
  socket1.bind(
    { address: common.localhostIPv4, port: PRT1, exclusive: false },
    () => process.send({ message: 'success', port1: socket1.address().port })
  );
}
