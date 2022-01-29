'use strict';
const assert = require('assert');
const { validateHeaderName, validateHeaderValue } = require('http');
isFunc(validateHeaderName, 'validateHeaderName');
isFunc(validateHeaderValue, 'validateHeaderValue');
console.log('validateHeaderName');
[
  'user-agent',
  'USER-AGENT',
  'User-Agent',
  'x-forwarded-for',
].forEach((name) => {
  console.log('does not throw for "%s"', name);
  validateHeaderName(name);
});
[
  'איקס-פורוורד-פור',
  'x-forwarded-fםr',
].forEach((name) => {
  console.log('throws for: "%s"', name.slice(0, 50));
  assert.throws(
    () => validateHeaderName(name),
    { code: 'ERR_INVALID_HTTP_TOKEN' }
  );
});
console.log('validateHeaderValue');
[
  ['x-valid', 1],
  ['x-valid', '1'],
  ['x-valid', 'string'],
].forEach(([name, value]) => {
  console.log('does not throw for "%s"', name);
  validateHeaderValue(name, value);
});
[
  ['x-undefined', undefined, 'ERR_HTTP_INVALID_HEADER_VALUE'],
  ['x-bad-char', 'לא תקין', 'ERR_INVALID_CHAR'],
].forEach(([name, value, code]) => {
  console.log('throws %s for: "%s: %s"', code, name, value);
  assert.throws(
    () => validateHeaderValue(name, value),
    { code }
  );
});
function isFunc(v, ttl) {
  assert.ok(v.constructor === Function, `${ttl} is expected to be a function`);
}
