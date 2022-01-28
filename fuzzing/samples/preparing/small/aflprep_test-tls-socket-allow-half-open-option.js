'use strict';
if (!common.hasCrypto)
  common.skip('missing crypto');
const assert = require('assert');
const net = require('net');
const stream = require('stream');
const tls = require('tls');
{
  const socket = new tls.TLSSocket(new net.Socket(), { allowHalfOpen: true });
  assert.strictEqual(socket.allowHalfOpen, false);
}
{
  const duplex = new stream.Duplex({
    allowHalfOpen: false,
    read() {}
  });
  const socket = new tls.TLSSocket(duplex, { allowHalfOpen: true });
  assert.strictEqual(socket.allowHalfOpen, false);
}
{
  const socket = new tls.TLSSocket();
  assert.strictEqual(socket.allowHalfOpen, false);
}
{
  const socket = new tls.TLSSocket(undefined, { allowHalfOpen: true });
  assert.strictEqual(socket.allowHalfOpen, true);
}
