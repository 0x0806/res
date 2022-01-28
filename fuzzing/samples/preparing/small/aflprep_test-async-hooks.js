'use strict';
const assert = require('assert');
const async_hooks = require('async_hooks');
process.emitWarning = () => {};
const expectedResource = {};
const expectedResourceType = 'test-resource';
let insideHook = false;
let expectedId;
async_hooks.createHook({
  init: common.mustCall((id, type, triggerAsyncId, resource) => {
    if (type !== expectedResourceType) {
      return;
    }
    assert.strictEqual(resource, expectedResource);
    expectedId = id;
  }),
  before: common.mustCall((id) => {
    assert.strictEqual(id, expectedId);
    insideHook = true;
  }),
  after: common.mustCall((id) => {
    assert.strictEqual(id, expectedId);
    insideHook = false;
  })
}).enable();
runInCallbackScope(expectedResource, expectedResourceType, () => {
  assert(insideHook);
});
