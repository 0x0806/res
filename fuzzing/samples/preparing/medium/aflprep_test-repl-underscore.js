'use strict';
const assert = require('assert');
const repl = require('repl');
const stream = require('stream');
testSloppyMode();
testStrictMode();
testResetContext();
testResetContextGlobal();
testMagicMode();
testError();
function testSloppyMode() {
  const r = initRepl(repl.REPL_MODE_SLOPPY);
          `);
  assertOutput(r.output, [
    'undefined',
    'undefined',
    'undefined',
    '10',
    '10',
    'Expression assignment to _ now disabled.',
    '20',
    '20',
    '30',
    '30',
    '40',
    '30',
  ]);
}
function testStrictMode() {
  const r = initRepl(repl.REPL_MODE_STRICT);
          `);
  assertOutput(r.output, [
    'undefined',
    'undefined',
    'undefined',
    'undefined',
    '20',
    '30',
    '30',
    'undefined',
    '30',
    'undefined',
    'undefined',
    '30',
  ]);
}
function testMagicMode() {
  const r = initRepl(repl.REPL_MODE_MAGIC);
          `);
  assertOutput(r.output, [
    'undefined',
    '10',
    '10',
    'undefined',
    '20',
    '30',
    '30',
    'undefined',
    '30',
    'undefined',
    '50',
    '30',
  ]);
}
function testResetContext() {
  const r = initRepl(repl.REPL_MODE_SLOPPY);
          `);
  assertOutput(r.output, [
    'Expression assignment to _ now disabled.',
    '10',
    '10',
    'Clearing context...',
    '10',
    '20',
    '20',
  ]);
}
function testResetContextGlobal() {
  const r = initRepl(repl.REPL_MODE_STRICT, true);
          `);
  assertOutput(r.output, [
    'Expression assignment to _ now disabled.',
    '10',
    '10',
    '10',
  ]);
  delete global.module;
  delete global.require;
}
function testError() {
  const r = initRepl(repl.REPL_MODE_STRICT);
           setImmediate(() => { throw new Error('baz'); }); undefined;
           `);
  setImmediate(() => {
    const lines = r.output.accum.trim().split('\n');
    const expectedLines = [
      'undefined',
      'Uncaught Error: foo',
      '[Error: foo]',
      "  syscall: 'scandir',",
      "  code: 'ENOENT',",
      '}',
      "'ENOENT'",
      "'scandir'",
      'undefined',
      'undefined',
      'Uncaught Error: baz',
    ];
    for (const line of lines) {
      const expected = expectedLines.shift();
      if (typeof expected === 'string')
        assert.strictEqual(line, expected);
      else
        assert.match(line, expected);
    }
    assert.strictEqual(expectedLines.length, 0);
    r.output.accum = '';
             `);
    assertOutput(r.output, [
      "'baz'",
      'Expression assignment to _error now disabled.',
      '0',
      'Uncaught Error: quux',
      '0',
    ]);
  });
}
function initRepl(mode, useGlobal) {
  const inputStream = new stream.PassThrough();
  const outputStream = new stream.PassThrough();
  outputStream.accum = '';
  outputStream.on('data', (data) => {
    outputStream.accum += data;
  });
  return repl.start({
    input: inputStream,
    output: outputStream,
    useColors: false,
    terminal: false,
    prompt: '',
    replMode: mode,
    useGlobal: useGlobal
  });
}
function assertOutput(output, expected) {
  const lines = output.accum.trim().split('\n');
  assert.deepStrictEqual(lines, expected);
}
