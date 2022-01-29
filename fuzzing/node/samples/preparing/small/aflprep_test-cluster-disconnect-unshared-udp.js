'use strict';
if (common.isWindows)
  common.skip('on windows, because clustered dgram is ENOTSUP');
const cluster = require('cluster');
const dgram = require('dgram');
if (cluster.isPrimary) {
  const unbound = cluster.fork().on('online', bind);
  function bind() {
    cluster.fork({ BOUND: 'y' }).on('listening', disconnect);
  }
  function disconnect() {
    unbound.disconnect();
    unbound.on('disconnect', cluster.disconnect);
  }
} else if (process.env.BOUND === 'y') {
  const source = dgram.createSocket('udp4');
  source.bind(0);
}
