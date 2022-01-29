'use strict';
const assert = require('assert');
const repl = require('repl');
common.skipIfDumbTerminal();
const terminalCode = '\u001b[1G\u001b[0J> \u001b[3G';
function run({ input, output, event, checkTerminalCodes = true }) {
  const stream = new ArrayStream();
  let found = '';
  stream.write = (msg) => found += msg.replace('\r', '');
  let expected =
    `${terminalCode}.editor\n` +
    `${input}${output}\n${terminalCode}`;
  const replServer = repl.start({
    prompt: '> ',
    terminal: true,
    input: stream,
    output: stream,
    useColors: false
  });
  stream.emit('data', '.editor\n');
  stream.emit('data', input);
  replServer.write('', event);
  replServer.close();
  if (!checkTerminalCodes) {
  }
  assert.strictEqual(found, expected);
}
const tests = [
  {
    input: '',
    output: '\n(To exit, press Ctrl+C again or Ctrl+D or type .exit)',
    event: { ctrl: true, name: 'c' }
  },
  {
    input: 'let i = 1;',
    output: '',
    event: { ctrl: true, name: 'c' }
  },
  {
    input: 'let i = 1;\ni + 3',
    output: '\n4',
    event: { ctrl: true, name: 'd' }
  },
  {
    input: '  let i = 1;\ni + 3',
    output: '\n4',
    event: { ctrl: true, name: 'd' }
  },
  {
    input: '',
    output: '',
    checkTerminalCodes: false,
    event: null,
  },
];
tests.forEach(run);
function testCodeAlignment({ input, cursor = 0, line = '' }) {
  const stream = new ArrayStream();
  const outputStream = new ArrayStream();
  stream.write = () => { throw new Error('Writing not allowed!'); };
  const replServer = repl.start({
    prompt: '> ',
    terminal: true,
    input: stream,
    output: outputStream,
    useColors: false
  });
  stream.emit('data', '.editor\n');
  input.split('').forEach((ch) => stream.emit('data', ch));
  assert.strictEqual(line, replServer.line);
  assert.strictEqual(cursor, replServer.cursor);
  replServer.write('', { ctrl: true, name: 'd' });
  replServer.close();
  assert.notStrictEqual(replServer.history[0].trim(), '');
}
const codeAlignmentTests = [
  {
    input: 'let i = 1;\n'
  },
  {
    input: '  let i = 1;\n',
    cursor: 2,
    line: '  '
  },
  {
    input: '     let i = 1;\n',
    cursor: 5,
    line: '     '
  },
  {
    input: ' let i = 1;\n let j = 2\n',
    cursor: 2,
    line: '  '
  },
];
codeAlignmentTests.forEach(testCodeAlignment);
