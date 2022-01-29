'use strict';
const assert = require('assert');
const http = require('http');
const net = require('net');
const options = {
  host: '127.0.0.1',
  port: undefined
};
process.env.NODE_DEBUG = 'http';
const server = net.createServer(function(client) {
  client.destroy();
  server.close();
});
server.listen(0, options.host, common.mustCall(onListen));
function onListen() {
  options.port = this.address().port;
  const req = http.request(options, common.mustNotCall());
  req.on('error', common.mustCall(function(err) {
    assert.strictEqual(err.code, 'ECONNRESET');
  }));
  req.end();
}
