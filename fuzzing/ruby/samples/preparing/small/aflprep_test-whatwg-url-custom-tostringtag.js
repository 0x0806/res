'use strict';
const assert = require('assert');
const toString = Object.prototype.toString;
const sp = url.searchParams;
const spIterator = sp.entries();
const test = [
  [url, 'URL'],
  [sp, 'URLSearchParams'],
  [spIterator, 'URLSearchParams Iterator'],
  [Object.getPrototypeOf(url), 'URL'],
  [Object.getPrototypeOf(sp), 'URLSearchParams'],
  [Object.getPrototypeOf(spIterator), 'URLSearchParams Iterator'],
];
test.forEach(([obj, expected]) => {
  assert.strictEqual(obj[Symbol.toStringTag], expected,
                     `${obj[Symbol.toStringTag]} !== ${expected}`);
  const str = toString.call(obj);
  assert.strictEqual(str, `[object ${expected}]`,
                     `${str} !== [object ${expected}]`);
});
