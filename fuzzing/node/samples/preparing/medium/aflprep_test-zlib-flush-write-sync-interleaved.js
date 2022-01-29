'use strict';
const assert = require('assert');
const { createGzip, createGunzip, Z_PARTIAL_FLUSH } = require('zlib');
const compress = createGzip();
const decompress = createGunzip();
decompress.setEncoding('utf8');
const events = [];
const compressedChunks = [];
for (const chunk of ['abc', 'def', 'ghi']) {
  compress.write(chunk, common.mustCall(() => events.push({ written: chunk })));
  compress.flush(Z_PARTIAL_FLUSH, common.mustCall(() => {
    events.push('flushed');
    const chunk = compress.read();
    if (chunk !== null)
      compressedChunks.push(chunk);
  }));
}
compress.end(common.mustCall(() => {
  events.push('compress end');
  writeToDecompress();
}));
function writeToDecompress() {
  const chunk = compressedChunks.shift();
  if (chunk === undefined) return decompress.end();
  decompress.write(chunk, common.mustCall(() => {
    events.push({ read: decompress.read() });
    writeToDecompress();
  }));
}
process.on('exit', () => {
  assert.deepStrictEqual(events, [
    { written: 'abc' },
    'flushed',
    { written: 'def' },
    'flushed',
    { written: 'ghi' },
    'flushed',
    'compress end',
    { read: 'abc' },
    { read: 'def' },
    { read: 'ghi' },
  ]);
});
