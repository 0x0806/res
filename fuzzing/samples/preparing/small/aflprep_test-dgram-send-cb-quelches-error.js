'use strict';
const mustCall = common.mustCall;
const assert = require('assert');
const dgram = require('dgram');
const dns = require('dns');
const socket = dgram.createSocket('udp4');
const buffer = Buffer.from('gary busey');
dns.setServers([]);
socket.once('error', onEvent);
socket.send(buffer, 0, buffer.length, 100,
            'dne.example.com', mustCall(callbackOnly));
function callbackOnly(err) {
  assert.ok(err);
  socket.removeListener('error', onEvent);
  socket.on('error', mustCall(onError));
  socket.send(buffer, 0, buffer.length, 100, 'dne.invalid');
}
function onEvent(err) {
  assert.fail(`Error should not be emitted if there is callback: ${err}`);
}
function onError(err) {
  assert.ok(err);
  socket.close();
}
