'use strict';
const assert = require('assert');
const parse = require('querystring').parse;
function createManyParams(count) {
  let str = '';
  if (count === 0) {
    return str;
  }
  str += '0=0';
  for (let i = 1; i < count; i++) {
    const n = i.toString(36);
    str += `&${n}=${n}`;
  }
  return str;
}
const count = 10000;
const originalMaxLength = 1000;
const params = createManyParams(count);
const resultInfinity = parse(params, undefined, undefined, {
  maxKeys: Infinity
});
const resultNaN = parse(params, undefined, undefined, {
  maxKeys: NaN
});
const resultInfinityString = parse(params, undefined, undefined, {
  maxKeys: 'Infinity'
});
const resultNaNString = parse(params, undefined, undefined, {
  maxKeys: 'NaN'
});
assert.strictEqual(Object.keys(resultInfinity).length, count);
assert.strictEqual(Object.keys(resultNaN).length, count);
assert.strictEqual(Object.keys(resultInfinityString).length, originalMaxLength);
assert.strictEqual(Object.keys(resultNaNString).length, originalMaxLength);
