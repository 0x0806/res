'use strict';
const assert = require('assert');
const async_hooks = require('async_hooks');
const fnsToTest = [setTimeout, (cb) => {
  setImmediate(() => {
    cb();
    setImmediate(() => {
      hook.disable();
    });
  });
}, (cb) => {
  setImmediate(() => {
    process.nextTick(() => {
      cb();
      setImmediate(() => {
        hook.disable();
        assert.strictEqual(fnsToTest.length, 0);
      });
    });
  });
}];
const hook = async_hooks.createHook({
  before: common.mustNotCall(),
  after: common.mustCall(() => {}, 3),
  destroy: common.mustCall(() => {
    hook.disable();
    nextTest();
  }, 3)
});
nextTest();
function nextTest() {
  if (fnsToTest.length > 0) {
    fnsToTest.shift()(common.mustCall(() => {
      hook.enable();
    }));
  }
}
