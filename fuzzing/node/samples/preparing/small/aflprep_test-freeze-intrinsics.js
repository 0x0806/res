'use strict';
const assert = require('assert');
assert.throws(
  () => Object.defineProperty = 'asdf',
  TypeError
);
{
  class ExtendedConsole extends console.Console {}
  const s = new ExtendedConsole(process.stdout);
  const logs = [];
  s.log = (msg) => logs.push(msg);
  s.log('custom');
  s.log = undefined;
  assert.strictEqual(s.log, undefined);
  assert.strictEqual(logs.length, 1);
  assert.strictEqual(logs[0], 'custom');
}
{
  const o = {};
  o.toString = () => 'Custom toString';
  assert.strictEqual(o + 'asdf', 'Custom toStringasdf');
  assert.strictEqual(Object.getOwnPropertyDescriptor(o, 'toString').enumerable,
                     true);
}
{
  assert.throws(() => { globalThis.globalThis = null; },
                { name: 'TypeError' });
  assert.strictEqual(globalThis.globalThis, globalThis);
}
