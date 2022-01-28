'use strict';
const dgram = require('dgram');
const buf = Buffer.alloc(1024, 42);
const socket = dgram.createSocket('udp4');
const portGetter = dgram.createSocket('udp4')
  .bind(0, 'localhost', common.mustCall(() => {
    socket.send(buf, 0, buf.length,
                portGetter.address().port,
                portGetter.address().address);
    socket.close('bad argument');
    portGetter.close();
    socket.on('close', common.mustCall());
  }));
