'use strict';
const assert = require('assert');
const unexpectedValues = [
  undefined,
  null,
  1,
  {},
  () => {},
];
for (const it of unexpectedValues) {
  assert.throws(() => {
    process.setSourceMapsEnabled(it);
}
