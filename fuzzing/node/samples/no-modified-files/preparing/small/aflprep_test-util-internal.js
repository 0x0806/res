'use strict';
const assert = require('assert');
const {
  getHiddenValue,
  setHiddenValue,
  arrow_message_private_symbol: kArrowMessagePrivateSymbolIndex
} = internalBinding('util');
assert.strictEqual(
  getHiddenValue({}, kArrowMessagePrivateSymbolIndex),
  undefined);
const obj = {};
assert.strictEqual(
  setHiddenValue(obj, kArrowMessagePrivateSymbolIndex, 'bar'),
  true);
assert.strictEqual(
  getHiddenValue(obj, kArrowMessagePrivateSymbolIndex),
  'bar');
let arrowMessage;
try {
  require(fixtures.path('syntax', 'bad_syntax'));
} catch (err) {
  arrowMessage =
      getHiddenValue(err, kArrowMessagePrivateSymbolIndex);
}
