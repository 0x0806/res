'use strict';
const assert = require('assert');
const net = require('net');
const server = net.createServer({});
server.listen(0, common.mustCall(function() {
  server._handle.getsockname = function(out) {
    return -1;
  };
  assert.throws(() => this.address(),
  server.close();
}));
