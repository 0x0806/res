'use strict';
const assert = require('assert');
const fs = require('fs');
const fsPromises = fs.promises;
const filepath = fixtures.path('x.txt');
const buf = Buffer.alloc(1);
fs.open(filepath, 'r', common.mustSucceed((fd) => {
  fs.read(fd, { offset: null, buffer: buf },
          common.mustSucceed((bytesRead, buffer) => {
            assert.strictEqual(buffer[0], 120);
            fs.close(fd, common.mustSucceed(() => {}));
          }));
}));
let filehandle = null;
(async () => {
  filehandle = await fsPromises.open(filepath, 'r');
  const readObject = await filehandle.read(buf, null, buf.length);
  assert.strictEqual(readObject.buffer[0], 120);
})()
.then(common.mustCall())
.finally(async () => {
  if (filehandle)
    await filehandle.close();
});
