'use strict';
const assert = require('assert');
const net = require('net');
{
  const server = net.createServer(common.mustNotCall());
  server.listen(common.mustCall(function() {
    assert.ok(server.address().port > 100);
    server.close();
  }));
}
{
  const server = net.createServer(common.mustNotCall());
  server.listen(common.PORT);
  setTimeout(function() {
    const address = server.address();
    assert.strictEqual(address.port, common.PORT);
    if (address.family === 'IPv6')
      assert.strictEqual(server._connectionKey, `6::::${address.port}`);
    else
      assert.strictEqual(server._connectionKey, `4:0.0.0.0:${address.port}`);
    server.close();
  }, 100);
}
{
  const server = net.createServer(common.mustNotCall());
  server.listen(common.PORT + 1, common.mustCall(function() {
    assert.strictEqual(server.address().port, common.PORT + 1);
    server.close();
  }));
}
{
  const server = net.createServer(common.mustNotCall());
  server.listen(common.PORT + 2, '0.0.0.0', 127, common.mustCall(function() {
    assert.strictEqual(server.address().port, common.PORT + 2);
    server.close();
  }));
}
{
  const server = net.createServer(common.mustNotCall());
  server.listen(common.PORT + 3, 127, common.mustCall(function() {
    assert.strictEqual(server.address().port, common.PORT + 3);
    server.close();
  }));
}
