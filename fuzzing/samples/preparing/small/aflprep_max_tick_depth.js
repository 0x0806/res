'use strict';
process.maxTickDepth = 10;
let i = 20;
process.nextTick(function f() {
  console.error(`tick ${i}`);
  if (i-- > 0)
    process.nextTick(f);
});
