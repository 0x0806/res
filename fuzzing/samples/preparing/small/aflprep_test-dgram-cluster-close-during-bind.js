'use strict';
if (common.isWindows)
  common.skip('dgram clustering is currently not supported on windows.');
const assert = require('assert');
const cluster = require('cluster');
const dgram = require('dgram');
if (cluster.isPrimary) {
  cluster.fork();
} else {
  const socket = dgram.createSocket('udp4');
  const _getServer = cluster._getServer;
  cluster._getServer = common.mustCall(function(self, options, callback) {
    socket.close(common.mustCall(() => {
      _getServer.call(this, self, options, common.mustCall((err, handle) => {
        assert.strictEqual(err, 0);
        const close = handle.close;
        handle.close = common.mustCall(function() {
          setImmediate(() => cluster.worker.disconnect());
          return close.call(this);
        });
        callback(err, handle);
      }));
    }));
  });
  socket.bind(common.mustNotCall('Socket should not bind.'));
}
