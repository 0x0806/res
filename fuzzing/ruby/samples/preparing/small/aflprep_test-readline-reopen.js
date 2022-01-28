'use strict';
const assert = require('assert');
const readline = require('readline');
const { PassThrough } = require('stream');
const input = new PassThrough();
const output = new PassThrough();
const rl1 = readline.createInterface({
  input,
  output,
  terminal: true
});
rl1.on('line', common.mustCall(rl1OnLine));
input.write(Buffer.concat([
  Buffer.from('foo\n'),
]));
function rl1OnLine(line) {
  assert.strictEqual(line, 'foo');
  rl1.close();
  const rl2 = readline.createInterface({
    input,
    output,
    terminal: true
  });
  rl2.on('line', common.mustCall((line) => {
    assert.strictEqual(line, '☃bar');
    rl2.close();
  }));
  input.write('bar\n');
}
