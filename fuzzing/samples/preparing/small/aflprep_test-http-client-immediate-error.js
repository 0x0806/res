'use strict';
const assert = require('assert');
const net = require('net');
const http = require('http');
const { UV_ENETUNREACH } = internalBinding('uv');
const {
  newAsyncId,
  symbols: { async_id_symbol }
const agent = new http.Agent();
agent.createConnection = common.mustCall((cfg) => {
  const sock = new net.Socket();
  sock._handle = {
    connect: common.mustCall((req, addr, port) => {
      return UV_ENETUNREACH;
    }),
    readStart() {},
    close() {}
  };
  sock[async_id_symbol] = newAsyncId();
  sock.connect(cfg);
  return sock;
});
http.get({
  host: '127.0.0.1',
  port: 1,
  agent
}).on('error', common.mustCall((err) => {
  assert.strictEqual(err.code, 'ENETUNREACH');
}));
