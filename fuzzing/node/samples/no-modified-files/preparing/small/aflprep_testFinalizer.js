'use strict';
const assert = require('assert');
let finalized = {};
const callback = common.mustCall(2);
test_general.addFinalizerOnly(finalized, callback);
test_general.addFinalizerOnly(finalized, callback);
assert.throws(() => test_general.unwrap(finalized),
              { name: 'Error', message: 'Invalid argument' });
assert.throws(() => test_general.removeWrap(finalized),
              { name: 'Error', message: 'Invalid argument' });
finalized = null;
global.gc();
async function testFinalizeAndWrap() {
  assert.strictEqual(test_general.derefItemWasCalled(), false);
  let finalizeAndWrap = {};
  test_general.wrap(finalizeAndWrap);
  test_general.addFinalizerOnly(finalizeAndWrap, common.mustCall());
  finalizeAndWrap = null;
  await common.gcUntil('test finalize and wrap',
                       () => test_general.derefItemWasCalled());
}
testFinalizeAndWrap();
