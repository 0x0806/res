'use strict';
const assert = require('assert');
const dnsPromises = require('dns').promises;
dnsPromises.lookupService('127.0.0.1', 22).then(common.mustCall((result) => {
  assert.strictEqual(result.service, 'ssh');
  assert.strictEqual(typeof result.hostname, 'string');
  assert.notStrictEqual(result.hostname.length, 0);
}));
assert.rejects(
  () => dnsPromises.lookupService('192.0.2.1', 22),
);
