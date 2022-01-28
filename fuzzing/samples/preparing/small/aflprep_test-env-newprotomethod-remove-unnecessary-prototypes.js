'use strict';
const assert = require('assert');
[
  internalBinding('udp_wrap').UDP.prototype.bind6,
  internalBinding('tcp_wrap').TCP.prototype.bind6,
  internalBinding('udp_wrap').UDP.prototype.send6,
  internalBinding('tcp_wrap').TCP.prototype.bind,
  internalBinding('udp_wrap').UDP.prototype.close,
  internalBinding('tcp_wrap').TCP.prototype.open,
].forEach((binding, i) => {
  assert.strictEqual('prototype' in binding, false, `Test ${i} failed`);
});
