'use strict';
const assert = require('assert');
const repl = require('repl');
let count = 0;
function run({ command, expected, useColors = false }) {
  let accum = '';
  const output = new ArrayStream();
  output.write = (data) => accum += data.replace('\r', '');
  const r = repl.start({
    prompt: '',
    input: new ArrayStream(),
    output,
    terminal: false,
    useColors
  });
  r.write(`${command}\n`);
  if (typeof expected === 'string') {
    assert.strictEqual(accum, expected);
  } else {
    assert.match(accum, expected);
  }
  accum = '';
  r.write('1 + 1\n');
  r.close();
  count++;
}
const tests = [
  {
    useColors: true,
    command: 'x',
    expected: 'Uncaught ReferenceError: x is not defined\n'
  },
  {
    useColors: true,
    command: 'throw { foo: "test" }',
    expected: "Uncaught { foo: \x1B[32m'test'\x1B[39m }\n"
  },
  {
    command: 'process.on("uncaughtException", () => console.log("Foobar"));\n',
  },
  {
    command: 'x;\n',
    expected: 'Uncaught ReferenceError: x is not defined\n'
  },
  {
    command: 'process.on("uncaughtException", () => console.log("Foobar"));' +
             'console.log("Baz");\n',
  },
  {
    command: 'console.log("Baz");' +
             'process.on("uncaughtException", () => console.log("Foobar"));\n',
  },
];
process.on('exit', () => {
  process.removeAllListeners('uncaughtException');
  assert.strictEqual(count, tests.length);
});
tests.forEach(run);
