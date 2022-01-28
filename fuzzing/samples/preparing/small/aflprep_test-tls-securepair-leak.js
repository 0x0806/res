'use strict';
if (!common.hasCrypto)
  common.skip('missing crypto');
const assert = require('assert');
const { createSecureContext } = require('tls');
const { createSecurePair } = require('tls');
const before = process.memoryUsage().external;
{
  const context = createSecureContext();
  const options = {};
  for (let i = 0; i < 1e4; i += 1)
    createSecurePair(context, false, false, false, options).destroy();
}
setImmediate(() => {
  global.gc();
  const after = process.memoryUsage().external;
  assert(after - before < 25 << 20);
});
