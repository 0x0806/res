'use strict';
const assert = require('assert');
const readline = require('readline');
const PassThrough = require('stream').PassThrough;
const stream = new PassThrough();
const sequence = [];
const keys = [];
readline.emitKeypressEvents(stream);
stream.on('keypress', (s, k) => {
  sequence.push(s);
  keys.push(k);
});
stream.write('foo');
assert.deepStrictEqual(sequence, ['f', 'o', 'o']);
assert.deepStrictEqual(keys, [
  { sequence: 'f', name: 'f', ctrl: false, meta: false, shift: false },
  { sequence: 'o', name: 'o', ctrl: false, meta: false, shift: false },
  { sequence: 'o', name: 'o', ctrl: false, meta: false, shift: false },
]);
