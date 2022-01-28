'use strict';
const assert = require('assert');
const net = require('net');
net.createServer(common.mustNotCall())
  .listen({ fd: 0 })
  .on('error', common.mustCall(function(e) {
    assert(e instanceof Error);
    assert(['EINVAL', 'ENOTSOCK'].includes(e.code));
  }));
