'use strict';
const assert = require('assert');
const repl = require('repl');
const stream = require('stream');
const inputStream = new stream.PassThrough();
const outputStream = new stream.PassThrough();
const fixture = path('is-object.js');
const r = repl.start({
  input: inputStream,
  output: outputStream,
  useGlobal: false
});
let output = '';
outputStream.setEncoding('utf8');
outputStream.on('data', (data) => output += data);
r.on('exit', common.mustCall(() => {
  assert.deepStrictEqual(results, ['undefined', 'true', 'true', '']);
}));
inputStream.write('const isObject = (obj) => obj.constructor === Object;\n');
inputStream.write('isObject({});\n');
inputStream.write(`require('${fixture}').isObject({});\n`);
r.close();
