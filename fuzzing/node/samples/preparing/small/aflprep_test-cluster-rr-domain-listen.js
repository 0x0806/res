'use strict';
const cluster = require('cluster');
const domain = require('domain');
if (cluster.isWorker) {
  const d = domain.create();
  d.run(() => {});
  const http = require('http');
  http.Server(() => {}).listen(0, '127.0.0.1');
} else if (cluster.isPrimary) {
  cluster.on('listening', function() {
    worker.kill();
  });
  cluster.on('exit', function() {
    process.exit(0);
  });
  const worker = cluster.fork();
}
