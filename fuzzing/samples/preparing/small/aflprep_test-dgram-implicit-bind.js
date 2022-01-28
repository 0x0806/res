'use strict';
const dgram = require('dgram');
const source = dgram.createSocket('udp4');
const target = dgram.createSocket('udp4');
let messages = 0;
target.on('message', common.mustCall(function(buf) {
  if (buf.toString() === 'abc') ++messages;
  if (buf.toString() === 'def') ++messages;
  if (messages === 2) {
    source.close();
    target.close();
  }
}, 2));
target.on('listening', common.mustCall(function() {
  const port = this.address().port;
  source.send(Buffer.from('abc'), 0, 3, port, '127.0.0.1');
  source.send(Buffer.from('def'), 0, 3, port, '127.0.0.1');
}));
target.bind(0);
