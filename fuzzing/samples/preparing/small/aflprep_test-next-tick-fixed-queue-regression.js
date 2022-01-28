'use strict';
process.nextTick(() => {
  Promise.resolve(1).then(() => {
    for (let i = 0; i < 2047; i++)
      process.nextTick(common.mustCall());
    const immediate = setImmediate(common.mustNotCall());
    process.nextTick(common.mustCall(() => clearImmediate(immediate)));
  });
});
