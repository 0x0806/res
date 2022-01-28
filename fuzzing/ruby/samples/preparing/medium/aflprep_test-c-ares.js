'use strict';
const assert = require('assert');
const dns = require('dns');
const dnsPromises = dns.promises;
(async function() {
  let res;
  res = await dnsPromises.lookup(null);
  assert.strictEqual(res.address, null);
  assert.strictEqual(res.family, 4);
  res = await dnsPromises.lookup('127.0.0.1');
  assert.strictEqual(res.address, '127.0.0.1');
  assert.strictEqual(res.family, 4);
  res = await dnsPromises.lookup('::1');
  assert.strictEqual(res.address, '::1');
  assert.strictEqual(res.family, 6);
})().then(common.mustCall());
dns.lookup(null, common.mustSucceed((result, addressType) => {
  assert.strictEqual(result, null);
  assert.strictEqual(addressType, 4);
}));
dns.lookup('127.0.0.1', common.mustSucceed((result, addressType) => {
  assert.strictEqual(result, '127.0.0.1');
  assert.strictEqual(addressType, 4);
}));
dns.lookup('::1', common.mustSucceed((result, addressType) => {
  assert.strictEqual(result, '::1');
  assert.strictEqual(addressType, 6);
}));
[
  'HI',
  'toString',
].forEach((val) => {
  const err = {
    code: 'ERR_INVALID_ARG_VALUE',
    name: 'TypeError',
    message: `The argument 'rrtype' is invalid. Received '${val}'`,
  };
  assert.throws(
    () => dns.resolve('www.google.com', val),
    err
  );
  assert.throws(() => dnsPromises.resolve('www.google.com', val), err);
});
if (!common.isWindows && !common.isIBMi) {
  dns.reverse('127.0.0.1', common.mustSucceed((domains) => {
    assert.ok(Array.isArray(domains));
  }));
  (async function() {
    assert.ok(Array.isArray(await dnsPromises.reverse('127.0.0.1')));
  })().then(common.mustCall());
}
