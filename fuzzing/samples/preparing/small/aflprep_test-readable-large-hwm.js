'use strict';
const { Readable } = require('stream');
const bufferSize = 10 * 1024 * 1024;
let n = 0;
const r = new Readable({
  read() {
    if (n++ > 10) {
      r.push(null);
    }
  }
});
r.on('readable', () => {
  while (true) {
    const ret = r.read(bufferSize);
    if (ret === null)
      break;
  }
});
r.on('end', common.mustCall());
