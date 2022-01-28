'use strict';
const stream = require('stream');
const assert = require('assert');
const readable = new stream.Readable({
  read: () => {}
});
const writables = [];
for (let i = 0; i < 5; i++) {
  const target = new stream.Writable({
    write: common.mustCall((chunk, encoding, callback) => {
      target.output.push(chunk);
      callback();
    }, 1)
  });
  target.output = [];
  target.on('pipe', common.mustCall());
  readable.pipe(target);
  writables.push(target);
}
const input = Buffer.from([1, 2, 3, 4, 5]);
readable.push(input);
process.nextTick(common.mustCall(() => {
  for (const target of writables) {
    assert.deepStrictEqual(target.output, [input]);
    target.on('unpipe', common.mustCall());
    readable.unpipe(target);
  }
  readable.push(null);
}));
readable.on('end', common.mustCall(() => {
  for (const target of writables) {
    assert.deepStrictEqual(target.output, [input]);
  }
}));
