'use strict';
const assert = require('assert');
const dgram = require('dgram');
const buf = Buffer.allocUnsafe(256 * 1024);
const sock = dgram.createSocket('udp4');
sock.send(buf, 0, buf.length, 12345, '127.0.0.1', common.mustCall(cb));
function cb(err) {
  assert(err instanceof Error);
  assert.strictEqual(err.code, 'EMSGSIZE');
  assert.strictEqual(err.address, '127.0.0.1');
  assert.strictEqual(err.port, 12345);
  assert.strictEqual(err.message, 'send EMSGSIZE 127.0.0.1:12345');
  sock.close();
}
