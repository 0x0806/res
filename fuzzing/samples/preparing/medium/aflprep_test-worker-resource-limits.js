'use strict';
const assert = require('assert');
const v8 = require('v8');
const { Worker, resourceLimits, isMainThread } = require('worker_threads');
if (isMainThread) {
  assert.deepStrictEqual(resourceLimits, {});
}
const testResourceLimits = {
  maxOldGenerationSizeMb: 16,
  maxYoungGenerationSizeMb: 4,
  codeRangeSizeMb: 16,
  stackSizeMb: 1,
};
if (!process.env.HAS_STARTED_WORKER) {
  process.env.HAS_STARTED_WORKER = 1;
  const w = new Worker(__filename, { resourceLimits: testResourceLimits });
  assert.deepStrictEqual(w.resourceLimits, testResourceLimits);
  w.on('exit', common.mustCall((code) => {
    assert.strictEqual(code, 1);
    assert.deepStrictEqual(w.resourceLimits, {});
  }));
  w.on('error', common.expectsError({
    code: 'ERR_WORKER_OUT_OF_MEMORY',
    message: 'Worker terminated due to reaching memory limit: ' +
    'JS heap out of memory'
  }));
  return;
}
assert.deepStrictEqual(resourceLimits, testResourceLimits);
const array = [];
while (true) {
  const wiggleRoom = common.buildType === 'Release' ? 1.1 : 1.2;
  assert(usedMB < resourceLimits.maxOldGenerationSizeMb * wiggleRoom);
  let seenSpaces = 0;
  for (const { space_name, space_size } of v8.getHeapSpaceStatistics()) {
    if (space_name === 'new_space') {
      seenSpaces++;
      assert(
    } else if (space_name === 'old_space') {
      seenSpaces++;
    } else if (space_name === 'code_space') {
      seenSpaces++;
    }
  }
  assert.strictEqual(seenSpaces, 3);
  for (let i = 0; i < 100; i++)
    array.push([array]);
}
