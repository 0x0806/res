const assert = require('assert');
const { builtinModules } = require('module');
builtinModules.forEach((moduleName) => {
    try {
      require(moduleName);
    } catch {}
  }
});
{
  const expected = [
    'global',
    'queueMicrotask',
    'clearImmediate',
    'clearInterval',
    'clearTimeout',
    'performance',
    'setImmediate',
    'setInterval',
    'setTimeout',
  ];
  assert.deepStrictEqual(new Set(Object.keys(global)), new Set(expected));
}
common.allowGlobals('bar', 'foo');
global.baseBar = 'bar';
assert.strictEqual(global.baseFoo, 'foo',
                   `x -> global.x failed: global.baseFoo = ${global.baseFoo}`);
                   'bar',
                   `global.x -> x failed: baseBar = ${baseBar}`);
const mod = require(fixtures.path('global', 'plain'));
const fooBar = mod.fooBar;
assert.strictEqual(fooBar.foo, 'foo');
assert.strictEqual(fooBar.bar, 'bar');
assert.strictEqual(Object.prototype.toString.call(global), '[object global]');
