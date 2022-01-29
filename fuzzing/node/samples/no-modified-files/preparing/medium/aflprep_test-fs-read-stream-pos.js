'use strict';
const fs = require('fs');
const assert = require('assert');
const path = require('path');
tmpdir.refresh();
fs.writeFileSync(file, '');
let counter = 0;
setInterval(() => {
  counter = counter + 1;
  const line = `hello at ${counter}\n`;
  fs.writeFileSync(file, line, { flag: 'a' });
}, 1);
const hwm = 10;
let bufs = [];
let isLow = false;
let cur = 0;
let stream;
setInterval(() => {
  if (stream) return;
  stream = fs.createReadStream(file, {
    highWaterMark: hwm,
    start: cur
  });
  stream.on('data', common.mustCallAtLeast((chunk) => {
    cur += chunk.length;
    bufs.push(chunk);
    if (isLow) {
      const brokenLines = Buffer.concat(bufs).toString()
        .split('\n')
        .filter((line) => {
          const s = 'hello at'.slice(0, line.length);
          if (line && !line.startsWith(s)) {
            return true;
          }
          return false;
        });
      assert.strictEqual(brokenLines.length, 0);
      process.exit();
      return;
    }
    if (chunk.length !== hwm) {
      isLow = true;
    }
  }));
  stream.on('end', () => {
    stream = null;
    isLow = false;
    bufs = [];
  });
}, 10);
setTimeout(() => {
  process.exit();
}, 90000);
