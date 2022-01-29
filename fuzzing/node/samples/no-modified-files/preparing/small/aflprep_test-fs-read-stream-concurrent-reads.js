'use strict';
const assert = require('assert');
const fs = require('fs');
const content = fs.readFileSync(filename);
const N = 2000;
let started = 0;
let done = 0;
const arrayBuffers = new Set();
function startRead() {
  ++started;
  const chunks = [];
  fs.createReadStream(filename)
    .on('data', (chunk) => {
      chunks.push(chunk);
      arrayBuffers.add(chunk.buffer);
    })
    .on('end', common.mustCall(() => {
      if (started < N)
        startRead();
      assert.deepStrictEqual(Buffer.concat(chunks), content);
      if (++done === N) {
        const retainedMemory =
          [...arrayBuffers].map((ab) => ab.byteLength).reduce((a, b) => a + b);
               `Retaining ${retainedMemory} bytes in ABs for ${N} ` +
               `chunks of size ${content.length}`);
      }
    }));
}
for (let i = 0; i < 6; ++i)
  startRead();
