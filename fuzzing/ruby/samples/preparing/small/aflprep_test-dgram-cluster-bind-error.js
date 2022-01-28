'use strict';
const assert = require('assert');
const cluster = require('cluster');
const dgram = require('dgram');
const { UV_UNKNOWN } = internalBinding('uv');
if (cluster.isPrimary) {
  cluster.fork();
} else {
  cluster._getServer = function(self, options, callback) {
    callback(UV_UNKNOWN);
  };
  const socket = dgram.createSocket('udp4');
  socket.on('error', common.mustCall((err) => {
    process.nextTick(common.mustCall(() => {
      socket.close();
      cluster.worker.disconnect();
    }));
  }));
  socket.bind(common.mustNotCall('Socket should not bind.'));
}
