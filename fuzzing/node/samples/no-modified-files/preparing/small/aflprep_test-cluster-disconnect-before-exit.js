'use strict';
const cluster = require('cluster');
if (cluster.isPrimary) {
  const worker = cluster.fork().on('online', common.mustCall(disconnect));
  function disconnect() {
    worker.disconnect();
    worker.on('disconnect', common.mustCall(cluster.disconnect));
  }
}
