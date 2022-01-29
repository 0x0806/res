'use strict';
const { PassThrough } = require('stream');
const readline = require('readline');
const assert = require('assert');
const ctrlU = { ctrl: true, name: 'u' };
common.skipIfDumbTerminal();
{
  const input = new PassThrough();
  const rl = readline.createInterface({
    terminal: true,
    input: input,
    prompt: ''
  });
  const tests = [
    [1, 'a'],
    [2, 'ab'],
    [2, '丁'],
  ];
  for (const [cursor, string] of tests) {
    rl.write(string);
    assert.strictEqual(rl.getCursorPos().cols, cursor);
    rl.write(null, ctrlU);
  }
}
