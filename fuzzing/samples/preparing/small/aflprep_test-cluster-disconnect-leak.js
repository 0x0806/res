'use strict';
const net = require('net');
const cluster = require('cluster');
cluster.schedulingPolicy = cluster.SCHED_NONE;
if (cluster.isPrimary) {
  const worker = cluster.fork();
  worker.on('disconnect', common.mustCall());
  worker.on('exit', common.mustCall());
  cluster.on('exit', common.mustCall());
  cluster.disconnect();
  return;
}
const server = net.createServer();
server.listen(0);
