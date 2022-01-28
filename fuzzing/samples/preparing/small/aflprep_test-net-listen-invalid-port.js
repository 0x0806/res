'use strict';
const assert = require('assert');
const net = require('net');
const invalidPort = -1 >>> 0;
net.Server().listen(0, function() {
  const address = this.address();
  const key = `${address.family.slice(-1)}:${address.address}:0`;
  assert.strictEqual(this._connectionKey, key);
  this.close();
});
assert.throws(() => {
  net.Server().listen({ port: invalidPort }, common.mustNotCall());
}, {
  code: 'ERR_SOCKET_BAD_PORT',
  name: 'RangeError'
});
assert.throws(() => {
  net.Server().listen(invalidPort, common.mustNotCall());
}, {
  code: 'ERR_SOCKET_BAD_PORT',
  name: 'RangeError'
});
assert.throws(() => {
  net.Server().listen(invalidPort, '0.0.0.0', common.mustNotCall());
}, {
  code: 'ERR_SOCKET_BAD_PORT',
  name: 'RangeError'
});
