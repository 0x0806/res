'use strict';
if (!common.hasCrypto)
  common.skip('missing crypto');
const assert = require('assert');
const tls = require('tls');
['fhqwhgads', 42, {}, []].forEach((testValue) => {
  assert.throws(
    () => { tls.createServer({ SNICallback: testValue }); },
  );
});
