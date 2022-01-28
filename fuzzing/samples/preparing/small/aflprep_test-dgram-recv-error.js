'use strict';
const assert = require('assert');
const dgram = require('dgram');
const s = dgram.createSocket('udp4');
const { handle } = s[kStateSymbol];
s.on('error', common.mustCall((err) => {
  s.close();
  assert.strictEqual(err.syscall, 'recvmsg');
}));
s.on('message', common.mustNotCall('no message should be received.'));
s.bind(common.mustCall(() => handle.onmessage(-1, handle, null, null)));
