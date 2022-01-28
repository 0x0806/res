'use strict';
const { Readable } = require('stream');
let count = 5;
const r = new Readable({
  read: common.mustCall(() => {
    process.nextTick(common.mustCall(() => {
      if (count--)
        r.push('a');
      else
        r.push(null);
    }));
  }, 6),
  highWaterMark: 0,
});
r.on('end', common.mustCall());
r.on('data', common.mustCall(5));
