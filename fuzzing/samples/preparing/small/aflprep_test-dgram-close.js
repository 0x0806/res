'use strict';
const assert = require('assert');
const dgram = require('dgram');
const buf = Buffer.alloc(1024, 42);
let socket = dgram.createSocket('udp4');
const { handle } = socket[kStateSymbol];
const portGetter = dgram.createSocket('udp4')
  .bind(0, 'localhost', common.mustCall(() => {
    socket.send(buf, 0, buf.length,
                portGetter.address().port,
                portGetter.address().address);
    assert.strictEqual(socket.close(common.mustCall()), socket);
    socket.on('close', common.mustCall());
    socket = null;
    setImmediate(function() {
      setImmediate(function() {
        console.log('Handle fd is: ', handle.fd);
      });
    });
    portGetter.close();
  }));
