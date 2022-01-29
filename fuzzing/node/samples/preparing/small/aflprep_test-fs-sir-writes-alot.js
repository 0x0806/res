'use strict';
const fs = require('fs');
const assert = require('assert');
const join = require('path').join;
const filename = join(tmpdir.path, 'out.txt');
tmpdir.refresh();
const fd = fs.openSync(filename, 'w');
const line = 'aaaaaaaaaaaaaaaaaaaaaaaaaaaa\n';
const N = 10240;
let complete = 0;
for (let i = 0; i < N; i++) {
  const buffer = Buffer.from(line);
  fs.write(fd, buffer, 0, buffer.length, null, function(er, written) {
    complete++;
    if (complete === N) {
      fs.closeSync(fd);
      const s = fs.createReadStream(filename);
      s.on('data', testBuffer);
    }
  });
}
let bytesChecked = 0;
function testBuffer(b) {
  for (let i = 0; i < b.length; i++) {
    bytesChecked++;
    if (b[i] !== 'a'.charCodeAt(0) && b[i] !== '\n'.charCodeAt(0)) {
      throw new Error(`invalid char ${i},${b[i]}`);
    }
  }
}
process.on('exit', function() {
  assert.ok(bytesChecked > 1000);
});
