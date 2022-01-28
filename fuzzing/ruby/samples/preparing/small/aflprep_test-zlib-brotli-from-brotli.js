'use strict';
const assert = require('assert');
const zlib = require('zlib');
const path = require('path');
tmpdir.refresh();
const decompress = new zlib.BrotliDecompress();
const fs = require('fs');
const fixture = fixtures.path('person.jpg.br');
const unzippedFixture = fixtures.path('person.jpg');
const outputFile = path.resolve(tmpdir.path, 'person.jpg');
const expect = fs.readFileSync(unzippedFixture);
const inp = fs.createReadStream(fixture);
const out = fs.createWriteStream(outputFile);
inp.pipe(decompress).pipe(out);
out.on('close', common.mustCall(() => {
  const actual = fs.readFileSync(outputFile);
  assert.strictEqual(actual.length, expect.length);
  for (let i = 0, l = actual.length; i < l; i++) {
    assert.strictEqual(actual[i], expect[i], `byte[${i}]`);
  }
}));
