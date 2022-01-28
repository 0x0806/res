'use strict';
const dgram = require('dgram');
dgram.createSocket('udp4');
dgram.createSocket('udp6');
{
  const s = dgram.createSocket('udp4');
  s.close(common.mustCall(() => s.ref()));
}
