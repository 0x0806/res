'use strict';
if (!common.hasCrypto)
  common.skip('missing crypto');
const assert = require('assert');
const tls = require('tls');
{
  const pctx = tls.createSecureContext().context;
  const cctx = Object.create(pctx);
  assert.throws(() => cctx._external, TypeError);
}
{
  const pctx = tls.createSecurePair().credentials.context;
  const cctx = Object.create(pctx);
  assert.throws(() => cctx._external, TypeError);
}
