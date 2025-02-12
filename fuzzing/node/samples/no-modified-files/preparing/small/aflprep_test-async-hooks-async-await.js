'use strict';
const async_hooks = require('async_hooks');
const assert = require('assert');
const asyncIds = [];
async_hooks.createHook({
  init: (asyncId, type, triggerAsyncId) => {
    asyncIds.push([triggerAsyncId, asyncId]);
  }
}).enable();
async function main() {
  await null;
}
main().then(() => {
  assert.strictEqual(asyncIds[0][1], asyncIds[1][0]);
  assert.strictEqual(asyncIds[0][1], asyncIds[3][0]);
  assert.strictEqual(asyncIds[1][1], asyncIds[2][0]);
});
