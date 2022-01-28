const assert = require('assert');
function test() {
  const code = [
    'var foo = {m: 1};',
    '',
    'function bar() {',
    '\'use strict\';',
    '};',
  ].join('\n');
  eval(code);
}
assert.deepStrictEqual(test(), { m: 1 });
