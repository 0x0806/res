'use strict';
const dgram = require('dgram');
{
  const s = dgram.createSocket('udp4');
  s.bind();
  s.unref();
}
{
  const s = dgram.createSocket('udp4');
  s.close(common.mustCall(() => s.unref()));
}
setTimeout(common.mustNotCall(), 1000).unref();
