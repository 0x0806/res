'use strict';
const assert = require('assert');
const EventEmitter = require('events');
const dgram = require('dgram');
const dns = require('dns');
const mockError = new Error('fake DNS');
dns.lookup = function(address, family, callback) {
  process.nextTick(() => { callback(mockError); });
};
const socket = dgram.createSocket('udp4');
socket.on(EventEmitter.errorMonitor, common.mustCall((err) => {
  assert.strictEqual(err, mockError);
  assert(Array.isArray(socket[kStateSymbol].queue));
  assert.strictEqual(socket[kStateSymbol].queue.length, 1);
}, 3));
socket.on('error', common.mustCall((err) => {
  assert.strictEqual(err, mockError);
  assert.strictEqual(socket[kStateSymbol].queue, undefined);
}, 3));
socket.send('foobar', common.PORT, 'localhost');
process.nextTick(() => {
  socket.send('foobar', common.PORT, 'localhost');
});
setImmediate(() => {
  socket.send('foobar', common.PORT, 'localhost');
});
