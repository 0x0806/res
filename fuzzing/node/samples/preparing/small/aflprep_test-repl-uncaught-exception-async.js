'use strict';
const repl = require('repl');
const assert = require('assert');
let accum = '';
const output = new ArrayStream();
output.write = (data) => accum += data.replace('\r', '');
const r = repl.start({
  prompt: '',
  input: new ArrayStream(),
  output,
  terminal: false,
  useColors: false,
  global: false
});
r.write(
  'process.nextTick(() => {\n' +
  '  process.on("uncaughtException", () => console.log("Foo"));\n' +
  '  throw new TypeError("foobar");\n' +
  '});\n'
);
r.write(
  'setTimeout(() => {\n' +
  '  throw new RangeError("abc");\n' +
  '}, 1);console.log()\n'
);
r.close();
setTimeout(() => {
  const len = process.listenerCount('uncaughtException');
  process.removeAllListeners('uncaughtException');
  assert.strictEqual(len, 0);
}, 2);
