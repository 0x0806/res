'use strict';
const assert = require('assert');
const net = require('net');
const server = net.createServer(common.mustNotCall());
server.listen(fp, common.mustNotCall());
server.on('error', common.mustCall(function(e) {
  assert.strictEqual(e.address, fp);
}));
