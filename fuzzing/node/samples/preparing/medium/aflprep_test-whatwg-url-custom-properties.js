'use strict';
const assert = require('assert');
const props = [];
for (const prop in url) {
  props.push(prop);
}
const expected = ['toString',
                  'href', 'origin', 'protocol',
                  'username', 'password', 'host', 'hostname', 'port',
                  'pathname', 'search', 'searchParams', 'hash', 'toJSON'];
assert.deepStrictEqual(props, expected);
assert.strictEqual(url.toString(), url.href);
assert.strictEqual(url.href,
assert.strictEqual(url.toString(), url.href);
assert.strictEqual((delete url.href), true);
assert.strictEqual(url.href,
assert.throws(
);
assert.strictEqual(url.toString(),
assert.strictEqual((delete url.origin), true);
url.protocol = 'https:';
assert.strictEqual(url.protocol, 'https:');
assert.strictEqual(url.toString(),
assert.strictEqual((delete url.protocol), true);
assert.strictEqual(url.protocol, 'https:');
url.username = 'user2';
assert.strictEqual(url.username, 'user2');
assert.strictEqual(url.toString(),
assert.strictEqual((delete url.username), true);
assert.strictEqual(url.username, 'user2');
url.password = 'pass2';
assert.strictEqual(url.password, 'pass2');
assert.strictEqual(url.toString(),
assert.strictEqual((delete url.password), true);
assert.strictEqual(url.password, 'pass2');
url.host = 'foo.bar.net:22';
assert.strictEqual(url.host, 'foo.bar.net:22');
assert.strictEqual(url.toString(),
assert.strictEqual((delete url.host), true);
assert.strictEqual(url.host, 'foo.bar.net:22');
url.hostname = 'foo.bar.org';
assert.strictEqual(url.hostname, 'foo.bar.org');
assert.strictEqual(url.toString(),
assert.strictEqual((delete url.hostname), true);
assert.strictEqual(url.hostname, 'foo.bar.org');
url.port = '23';
assert.strictEqual(url.port, '23');
assert.strictEqual(url.toString(),
assert.strictEqual((delete url.port), true);
assert.strictEqual(url.port, '23');
assert.strictEqual(url.toString(),
assert.strictEqual((delete url.pathname), true);
url.search = '?k=99';
assert.strictEqual(url.search, '?k=99');
assert.strictEqual(url.toString(),
assert.strictEqual((delete url.search), true);
assert.strictEqual(url.search, '?k=99');
url.hash = '#abcd';
assert.strictEqual(url.hash, '#abcd');
assert.strictEqual(url.toString(),
assert.strictEqual((delete url.hash), true);
assert.strictEqual(url.hash, '#abcd');
assert.throws(
  () => url.searchParams = '?k=88',
);
assert.strictEqual(url.searchParams, oldParams);
assert.strictEqual(url.toString(),
assert.strictEqual((delete url.searchParams), true);
assert.strictEqual(url.searchParams, oldParams);
[
].forEach((test) => {
  assert.strictEqual(new URL(test.url).origin, test.expected);
});
