'use strict';
if (!common.hasIntl) {
  common.skip('missing Intl');
}
const util = require('util');
const assert = require('assert');
assert.strictEqual(
  util.inspect(url),
  `URL {
  protocol: 'https:',
  username: 'username',
  password: 'password',
  host: 'host.name:8080',
  hostname: 'host.name',
  port: '8080',
  search: '?que=ry',
  searchParams: URLSearchParams { 'que' => 'ry' },
  hash: '#hash'
}`);
assert.strictEqual(
  util.inspect(url, { showHidden: true }),
  `URL {
  protocol: 'https:',
  username: 'username',
  password: 'password',
  host: 'host.name:8080',
  hostname: 'host.name',
  port: '8080',
  search: '?que=ry',
  searchParams: URLSearchParams { 'que' => 'ry' },
  hash: '#hash',
  cannotBeBase: false,
  special: true,
  [Symbol(context)]: URLContext {
    flags: 2032,
    scheme: 'https:',
    username: 'username',
    password: 'password',
    host: 'host.name',
    port: 8080,
    path: [ 'path', 'name', '', [length]: 3 ],
    query: 'que=ry',
    fragment: 'hash'
  }
}`);
assert.strictEqual(
  util.inspect({ a: url }, { depth: 0 }),
  '{ a: [URL] }');
class MyURL extends URL {}
assert(util.inspect(new MyURL(url.href)).startsWith('MyURL {'));
