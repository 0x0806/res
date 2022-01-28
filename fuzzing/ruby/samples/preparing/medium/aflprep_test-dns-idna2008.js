'use strict';
const assert = require('assert');
const dns = require('dns');
const fixture = {
  hostname: 'straße.de',
  expectedAddress: '81.169.145.78',
  dnsServer: addresses.DNS4_SERVER,
  family: 4,
};
dns.setServers([fixture.dnsServer]);
dns.lookup(
  fixture.hostname,
  { family: fixture.family },
  mustCall((err, address) => {
    if (err && err.errno === 'ESERVFAIL') {
      assert.ok(err.message.includes('queryA ESERVFAIL straße.de'));
      return;
    }
    assert.ifError(err);
    assert.strictEqual(address, fixture.expectedAddress);
  })
);
dns.promises.lookup(fixture.hostname, { family: fixture.family })
  .then(({ address }) => {
    assert.strictEqual(address, fixture.expectedAddress);
  }, (err) => {
    if (err && err.errno === 'ESERVFAIL') {
      assert.ok(err.message.includes('queryA ESERVFAIL straße.de'));
    } else {
      throw err;
    }
  }).finally(mustCall());
dns.resolve4(fixture.hostname, mustCall((err, addresses) => {
  if (err && err.errno === 'ESERVFAIL') {
    assert.ok(err.message.includes('queryA ESERVFAIL straße.de'));
    return;
  }
  assert.ifError(err);
  assert.deepStrictEqual(addresses, [fixture.expectedAddress]);
}));
const p = new dns.promises.Resolver().resolve4(fixture.hostname);
p.then((addresses) => {
  assert.deepStrictEqual(addresses, [fixture.expectedAddress]);
}, (err) => {
  if (err && err.errno === 'ESERVFAIL') {
    assert.ok(err.message.includes('queryA ESERVFAIL straße.de'));
  } else {
    throw err;
  }
}).finally(mustCall());
