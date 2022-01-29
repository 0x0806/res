'use strict';
const { Resolver } = require('dns');
const dgram = require('dgram');
const { Worker, isMainThread } = require('worker_threads');
if (isMainThread) {
  return new Worker(__filename);
}
const socket = dgram.createSocket('udp4');
socket.bind(0, common.mustCall(() => {
  const resolver = new Resolver();
  resolver.setServers([`127.0.0.1:${socket.address().port}`]);
  resolver.resolve4('example.org', common.mustNotCall());
}));
socket.on('message', common.mustCall(() => {
  process.exit();
}));
