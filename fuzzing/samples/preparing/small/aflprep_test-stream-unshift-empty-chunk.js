'use strict';
const assert = require('assert');
const Readable = require('stream').Readable;
const r = new Readable();
let nChunks = 10;
const chunk = Buffer.alloc(10, 'x');
r._read = function(n) {
  setImmediate(() => {
    r.push(--nChunks === 0 ? null : chunk);
  });
};
let readAll = false;
const seen = [];
r.on('readable', () => {
  let chunk;
  while (chunk = r.read()) {
    seen.push(chunk.toString());
    const putBack = Buffer.alloc(readAll ? 0 : 5, 'y');
    readAll = !readAll;
    r.unshift(putBack);
  }
});
const expect =
  [ 'xxxxxxxxxx',
    'yyyyy',
    'xxxxxxxxxx',
    'yyyyy',
    'xxxxxxxxxx',
    'yyyyy',
    'xxxxxxxxxx',
    'yyyyy',
    'xxxxxxxxxx',
    'yyyyy',
    'xxxxxxxxxx',
    'yyyyy',
    'xxxxxxxxxx',
    'yyyyy',
    'xxxxxxxxxx',
    'yyyyy',
    'xxxxxxxxxx',
    'yyyyy' ];
r.on('end', () => {
  assert.deepStrictEqual(seen, expect);
  console.log('ok');
});
