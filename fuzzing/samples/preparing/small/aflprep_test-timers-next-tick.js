'use strict';
setTimeout(common.mustCall(() => {
  process.nextTick(() => {
    clearTimeout(t2);
    clearTimeout(t3);
  });
}), 1);
const t2 = setTimeout(common.mustNotCall(), 1);
const t3 = setTimeout(common.mustNotCall(), 1);
setTimeout(common.mustCall(), 1);
sleep(5);
setImmediate(common.mustCall(() => {
  process.nextTick(() => {
    clearImmediate(i2);
    clearImmediate(i3);
  });
}));
const i2 = setImmediate(common.mustNotCall());
const i3 = setImmediate(common.mustNotCall());
setImmediate(common.mustCall());
