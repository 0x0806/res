'use strict';
const assert = require('assert');
{
  assert.strictEqual(url.hash, '');
  assert.strictEqual(url.host, 'foo.com');
  assert.strictEqual(url.hostname, 'bar.com');
  assert.strictEqual(url.password, '');
  assert.strictEqual(url.protocol, 'http:');
  assert.strictEqual(url.username, '');
  assert.strictEqual(url.search, '');
  assert.strictEqual(url.searchParams.toString(), '');
}
