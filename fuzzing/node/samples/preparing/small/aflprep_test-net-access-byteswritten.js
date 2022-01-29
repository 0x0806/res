'use strict';
if (!common.hasCrypto)
  common.skip('missing crypto');
const assert = require('assert');
const net = require('net');
const tls = require('tls');
const tty = require('tty');
assert.strictEqual(net.Socket.prototype.bytesWritten, undefined);
assert.strictEqual(Object.getPrototypeOf(tls.TLSSocket).prototype.bytesWritten,
                   undefined);
assert.strictEqual(tls.TLSSocket.prototype.bytesWritten, undefined);
assert.strictEqual(Object.getPrototypeOf(tty.ReadStream).prototype.bytesWritten,
                   undefined);
assert.strictEqual(tty.ReadStream.prototype.bytesWritten, undefined);
assert.strictEqual(tty.WriteStream.prototype.bytesWritten, undefined);
