'use strict';
const assert = require('assert');
const dnsPromises = require('dns').promises;
{
  const rrtype = 'DUMMY';
  assert.throws(
    () => dnsPromises.resolve('example.org', rrtype),
    {
      code: 'ERR_INVALID_ARG_VALUE',
      name: 'TypeError',
      message: `The argument 'rrtype' is invalid. Received '${rrtype}'`
    }
  );
}
{
  const rrtype = 0;
  assert.throws(
    () => dnsPromises.resolve('example.org', rrtype),
    {
      code: 'ERR_INVALID_ARG_TYPE',
      name: 'TypeError',
      message: 'The "rrtype" argument must be of type string. ' +
               `Received type ${typeof rrtype} (${rrtype})`
    }
  );
}
{
  (async function() {
    const rrtype = undefined;
    const result = await dnsPromises.resolve('example.org', rrtype);
    assert.ok(result !== undefined);
    assert.ok(result.length > 0);
  })().then(common.mustCall());
}
