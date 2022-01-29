'use strict';
const assert = require('assert');
const immediate = setImmediate(() => {});
assert.strictEqual(immediate.hasRef(), true);
immediate.unref();
assert.strictEqual(immediate.hasRef(), false);
clearImmediate(immediate);
setImmediate(common.mustCall(firstStep)).ref().unref().unref().ref();
function firstStep() {
  setImmediate(common.mustCall()).unref();
  setTimeout(common.mustCall(() => { setImmediate(secondStep); }), 0);
}
function secondStep() {
  const immA = setImmediate(() => {
    clearImmediate(immA);
    clearImmediate(immB);
    immA.ref();
    immB.ref();
  }).unref();
  const immB = setImmediate(common.mustNotCall()).unref();
  setImmediate(common.mustCall(finalStep));
}
function finalStep() {
  setImmediate(common.mustNotCall()).unref();
}
