'use strict';
const assert = require('assert');
const net = require('net');
{
  const family = 'IPv4';
  const server = net.createServer();
  server.on('error', common.mustNotCall());
  server
    .listen(common.PORT + 1, common.localhostIPv4, common.mustCall(() => {
      const address4 = server.address();
      assert.strictEqual(address4.address, common.localhostIPv4);
      assert.strictEqual(address4.port, common.PORT + 1);
      assert.strictEqual(address4.family, family);
      server.close();
    }));
}
if (!common.hasIPv6) {
  common.printSkipMessage('ipv6 part of test, no IPv6 support');
  return;
}
const family6 = 'IPv6';
const anycast6 = '::';
{
  const localhost = '::1';
  const server = net.createServer();
  server.on('error', common.mustNotCall());
  server.listen(common.PORT + 2, localhost, common.mustCall(() => {
    const address = server.address();
    assert.strictEqual(address.address, localhost);
    assert.strictEqual(address.port, common.PORT + 2);
    assert.strictEqual(address.family, family6);
    server.close();
  }));
}
{
  const server = net.createServer();
  server.on('error', common.mustNotCall());
  server.listen(common.PORT + 3, common.mustCall(() => {
    const address = server.address();
    assert.strictEqual(address.address, anycast6);
    assert.strictEqual(address.port, common.PORT + 3);
    assert.strictEqual(address.family, family6);
    server.close();
  }));
}
{
  const server = net.createServer();
  server.on('error', common.mustNotCall());
  server.listen(common.mustCall(() => {
    const address = server.address();
    assert.strictEqual(address.address, anycast6);
    assert.strictEqual(address.family, family6);
    server.close();
  }));
}
{
  const server = net.createServer();
  server.on('error', common.mustNotCall());
  server.listen(0, common.mustCall(() => {
    const address = server.address();
    assert.strictEqual(address.address, anycast6);
    assert.strictEqual(address.family, family6);
    server.close();
  }));
}
