'use strict';
const url = require('url');
const assert = require('assert');
const tests = require(
  fixtures.path('wpt', 'url', 'resources', 'urltestdata.json')
);
let failed = 0;
let attempted = 0;
tests.forEach((test) => {
  attempted++;
  if (typeof test === 'string') return;
  let parsed;
  try {
    parsed = url.parse(url.resolve(test.base, test.input));
    if (test.failure) {
      failed++;
    } else {
      let username, password;
      try {
        assert.strictEqual(test.href, parsed.href);
        assert.strictEqual(test.protocol, parsed.protocol);
        username = parsed.auth ? parsed.auth.split(':', 2)[0] : '';
        password = parsed.auth ? parsed.auth.split(':', 2)[1] : '';
        assert.strictEqual(test.username, username);
        assert.strictEqual(test.password, password);
        assert.strictEqual(test.host, parsed.host);
        assert.strictEqual(test.hostname, parsed.hostname);
        assert.strictEqual(+test.port, +parsed.port);
        assert.strictEqual(test.search, parsed.search || '');
        assert.strictEqual(test.hash, parsed.hash || '');
      } catch {
        failed++;
      }
    }
  } catch {
    if (!test.failure)
      failed++;
  }
});
assert.ok(failed === 0, `${failed} failed tests (out of ${attempted})`);
