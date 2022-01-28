'use strict';
const assert = require('assert');
let mainFinished = false;
setImmediate(common.mustCall(function() {
  assert.strictEqual(mainFinished, true);
  clearImmediate(immediateB);
}));
const immediateB = setImmediate(common.mustNotCall());
setImmediate(common.mustCall((...args) => {
  assert.deepStrictEqual(args, [1, 2, 3]);
}), 1, 2, 3);
setImmediate(common.mustCall((...args) => {
  assert.deepStrictEqual(args, [1, 2, 3, 4, 5]);
}), 1, 2, 3, 4, 5);
mainFinished = true;
