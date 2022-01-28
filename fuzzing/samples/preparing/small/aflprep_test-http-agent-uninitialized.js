'use strict';
const http = require('http');
const net = require('net');
const agent = new http.Agent({
  keepAlive: true,
});
const socket = new net.Socket();
const server = http.createServer(common.mustCall((req, res) => {
  res.end();
})).listen(0, common.mustCall(() => {
  agent.freeSockets[agent.getName(req)] = [socket];
  agent.addRequest(req, {});
  req.on('response', common.mustCall(() => {
    server.close();
  }));
  req.end();
}));
