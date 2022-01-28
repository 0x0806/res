'use strict';
const assert = require('assert');
const expected_keys = [
  'ares',
  'brotli',
  'modules',
  'node',
  'uv',
  'v8',
  'zlib',
  'nghttp2',
  'napi',
  'llhttp',
];
if (common.hasCrypto) {
  expected_keys.push('openssl');
}
if (common.hasQuic) {
  expected_keys.push('ngtcp2');
  expected_keys.push('nghttp3');
}
if (common.hasIntl) {
  expected_keys.push('icu');
  expected_keys.push('cldr');
  expected_keys.push('tz');
  expected_keys.push('unicode');
}
expected_keys.sort();
const actual_keys = Object.keys(process.versions).sort();
assert.deepStrictEqual(actual_keys, expected_keys);
assert.match(process.versions.ares, commonTemplate);
assert.match(process.versions.brotli, commonTemplate);
assert.match(process.versions.llhttp, commonTemplate);
assert.match(process.versions.node, commonTemplate);
assert.match(process.versions.uv, commonTemplate);
assert.match(process.versions.zlib, commonTemplate);
assert.match(
  process.versions.v8,
);
if (common.hasCrypto) {
  const versionRegex = common.hasOpenSSL3 ?
  assert.match(process.versions.openssl, versionRegex);
}
for (let i = 0; i < expected_keys.length; i++) {
  const key = expected_keys[i];
  const descriptor = Object.getOwnPropertyDescriptor(process.versions, key);
  assert.strictEqual(descriptor.writable, false);
}
assert.strictEqual(process.config.variables.napi_build_version,
                   process.versions.napi);
