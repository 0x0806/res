'use strict';
const stream = require('stream');
const assert = require('assert');
const globalTestCases = [
  [false, 'undefined'],
  [true, '\'tacos\''],
  [undefined, 'undefined'],
];
const globalTest = (useGlobal, cb, output) => (err, repl) => {
  if (err)
    return cb(err);
  let str = '';
  output.on('data', (data) => (str += data));
  global.lunch = 'tacos';
  repl.write('global.lunch;\n');
  repl.close();
  delete global.lunch;
  cb(null, str.trim());
};
for (const [option, expected] of globalTestCases) {
  runRepl(option, globalTest, common.mustSucceed((output) => {
    assert.strictEqual(output, expected);
  }));
}
const processTestCases = [false, undefined];
const processTest = (useGlobal, cb, output) => (err, repl) => {
  if (err)
    return cb(err);
  let str = '';
  output.on('data', (data) => (str += data));
  repl.write('let process;\n');
  repl.write('21 * 2;\n');
  repl.close();
  cb(null, str.trim());
};
for (const option of processTestCases) {
  runRepl(option, processTest, common.mustSucceed((output) => {
    assert.strictEqual(output, 'undefined\n42');
  }));
}
function runRepl(useGlobal, testFunc, cb) {
  const inputStream = new stream.PassThrough();
  const outputStream = new stream.PassThrough();
  const opts = {
    input: inputStream,
    output: outputStream,
    useGlobal: useGlobal,
    useColors: false,
    terminal: false,
    prompt: ''
  };
  repl.createInternalRepl(
    process.env,
    opts,
    testFunc(useGlobal, cb, opts.output));
}
