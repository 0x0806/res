'use strict';
if (!common.hasIntl) {
  common.skip('missing Intl');
}
const assert = require('assert');
const tests = require(
  fixtures.path('wpt', 'url', 'resources', 'urltestdata.json')
);
const originalFailures = tests.filter((test) => test.failure);
const typeFailures = [
  { input: '' },
  { input: 'test' },
  { input: undefined },
  { input: 0 },
  { input: true },
  { input: false },
  { input: null },
  { input: new Date() },
  { input: new RegExp() },
  { input: 'test', base: null },
  { input: () => {} },
];
const aboutBlankFailures = originalFailures
  .map((test) => ({
    input: 'about:blank',
    base: test.input,
    failure: true
  }));
const failureTests = originalFailures
  .concat(typeFailures)
  .concat(aboutBlankFailures);
const expectedError = { code: 'ERR_INVALID_URL', name: 'TypeError' };
for (const test of failureTests) {
  assert.throws(
    () => new URL(test.input, test.base),
    (error) => {
      assert.throws(() => { throw error; }, expectedError);
      assert.strictEqual(`${error}`, 'TypeError [ERR_INVALID_URL]: Invalid URL');
      assert.strictEqual(error.message, 'Invalid URL');
      return true;
    });
}
const additional_tests =
  require(fixtures.path('url-tests-additional.js'));
for (const test of additional_tests) {
  const url = new URL(test.url);
  if (test.href) assert.strictEqual(url.href, test.href);
  if (test.origin) assert.strictEqual(url.origin, test.origin);
  if (test.protocol) assert.strictEqual(url.protocol, test.protocol);
  if (test.username) assert.strictEqual(url.username, test.username);
  if (test.password) assert.strictEqual(url.password, test.password);
  if (test.hostname) assert.strictEqual(url.hostname, test.hostname);
  if (test.host) assert.strictEqual(url.host, test.host);
  if (test.port !== undefined) assert.strictEqual(url.port, test.port);
  if (test.pathname) assert.strictEqual(url.pathname, test.pathname);
  if (test.search) assert.strictEqual(url.search, test.search);
  if (test.hash) assert.strictEqual(url.hash, test.hash);
}
