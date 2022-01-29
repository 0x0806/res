'use strict';
const assert = require('assert');
const { Duplex } = require('stream');
process.once('uncaughtException', common.mustCall((err) => {
  assert.strictEqual(err.message, 'exception!');
}));
const socket = new JSStreamWrap(new Duplex({
  read: common.mustCall(),
  write: common.mustCall((buffer, data, cb) => {
    throw new Error('exception!');
  })
}));
socket.end('foo');
socket.on('error', common.expectsError({
  name: 'Error',
  message: 'write EPROTO'
}));
