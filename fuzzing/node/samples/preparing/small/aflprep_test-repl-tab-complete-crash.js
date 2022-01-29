'use strict';
const assert = require('assert');
const repl = require('repl');
ArrayStream.prototype.write = () => {};
const putIn = new ArrayStream();
const testMe = repl.start('', putIn);
putIn.run(['.clear']);
putIn.run(['function () {']);
testMe.complete('arguments.', common.mustCall((err, completions) => {
  assert.strictEqual(err, null);
  assert.deepStrictEqual(completions, [[], 'arguments.']);
}));
putIn.run(['.clear']);
putIn.run(['function () {']);
putIn.run(['undef;']);
testMe.complete('undef.', common.mustCall((err, completions) => {
  assert.strictEqual(err, null);
  assert.deepStrictEqual(completions, [[], 'undef.']);
}));
