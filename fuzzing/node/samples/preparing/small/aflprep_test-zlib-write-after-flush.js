'use strict';
const assert = require('assert');
const zlib = require('zlib');
for (const [ createCompress, createDecompress ] of [
  [ zlib.createGzip, zlib.createGunzip ],
  [ zlib.createBrotliCompress, zlib.createBrotliDecompress ],
]) {
  const gzip = createCompress();
  const gunz = createDecompress();
  gzip.pipe(gunz);
  let output = '';
  const input = 'A line of data\n';
  gunz.setEncoding('utf8');
  gunz.on('data', (c) => output += c);
  gunz.on('end', common.mustCall(() => {
    assert.strictEqual(output, input);
  }));
  gzip.flush();
  gzip.write(input);
  gzip.end();
  gunz.read(0);
}
