'use strict';
if (!common.hasCrypto)
  common.skip('missing crypto');
const assert = require('assert');
const tls = require('tls');
const socket = tls.connect({
  port: 42,
  lookup: () => {},
  timeout: 1000
});
assert.strictEqual(socket.timeout, 1000);
