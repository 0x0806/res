'use strict';
const Duplex = require('stream').Duplex;
{
  const stream = new Duplex({
    read() {},
    write() {}
  });
  stream.setEncoding('ascii');
  const wrap = new StreamWrap(stream);
  wrap.on('error', common.expectsError({
    name: 'Error',
    code: 'ERR_STREAM_WRAP',
    message: 'Stream has StringDecoder set or is in objectMode'
  }));
  stream.push('ohai');
}
{
  const stream = new Duplex({
    read() {},
    write() {},
    objectMode: true
  });
  const wrap = new StreamWrap(stream);
  wrap.on('error', common.expectsError({
    name: 'Error',
    code: 'ERR_STREAM_WRAP',
    message: 'Stream has StringDecoder set or is in objectMode'
  }));
  stream.push(new Error('foo'));
}
