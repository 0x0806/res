'use strict';
if (!common.hasIPv6)
  common.skip('no IPv6 support');
const assert = require('assert');
const net = require('net');
const hostAddrIPv6 = '::1';
const HOSTNAME = 'dummy';
const server = net.createServer({ allowHalfOpen: true }, (socket) => {
  socket.resume();
  socket.on('end', common.mustCall());
  socket.end();
});
function tryConnect() {
  const connectOpt = {
    host: HOSTNAME,
    port: server.address().port,
    family: 6,
    allowHalfOpen: true,
    lookup: common.mustCall((addr, opt, cb) => {
      assert.strictEqual(addr, HOSTNAME);
      assert.strictEqual(opt.family, 6);
      cb(null, hostAddrIPv6, opt.family);
    })
  };
  const client = net.connect(connectOpt, () => {
    client.resume();
    client.on('end', () => {
      setTimeout(function() {
        assert(client.writable);
        client.end();
      }, 10);
    });
    client.on('close', () => server.close());
  });
}
server.listen(0, hostAddrIPv6, tryConnect);
