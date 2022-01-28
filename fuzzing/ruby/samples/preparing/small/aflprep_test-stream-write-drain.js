'use strict';
const { Writable } = require('stream');
const w = new Writable({
  write(data, enc, cb) {
    process.nextTick(cb);
  },
  highWaterMark: 1
});
w.on('drain', common.mustNotCall());
w.write('asd');
w.end();
