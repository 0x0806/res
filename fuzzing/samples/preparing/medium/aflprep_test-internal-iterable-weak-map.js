'use strict';
const { deepStrictEqual, strictEqual } = require('assert');
Reflect.getPrototypeOf(function*() {}).prototype.next = common.mustNotCall();
Reflect.getPrototypeOf(new Set()[Symbol.iterator]()).next =
  common.mustNotCall();
{
  const wm = new IterableWeakMap();
  const _cache = {
    moduleA: {},
    moduleB: {},
    moduleC: {},
  };
  wm.set(_cache.moduleA, 'hello');
  wm.set(_cache.moduleB, 'discard');
  wm.set(_cache.moduleC, 'goodbye');
  delete _cache.moduleB;
  setImmediate(() => {
    globalThis.gc();
    const values = [...wm];
    deepStrictEqual(values, ['hello', 'goodbye']);
  });
}
{
  const wm = new IterableWeakMap();
  const _cache = {
    moduleA: {},
    moduleB: {},
  };
  wm.set(_cache.moduleA, 'hello');
  wm.set(_cache.moduleB, 'goodbye');
  wm.set(_cache.moduleB, 'goodnight');
  const values = [...wm];
  deepStrictEqual(values, ['hello', 'goodnight']);
}
{
  const wm = new IterableWeakMap();
  const _cache = {
    moduleA: {},
    moduleB: {},
    moduleC: {},
  };
  wm.set(_cache.moduleA, 'hello');
  wm.set(_cache.moduleB, 'discard');
  wm.set(_cache.moduleC, 'goodbye');
  wm.delete(_cache.moduleB);
  const values = [...wm];
  deepStrictEqual(values, ['hello', 'goodbye']);
}
{
  const wm = new IterableWeakMap();
  const _cache = {
    moduleA: {},
    moduleB: {},
    moduleC: {},
  };
  wm.set(_cache.moduleA, 'hello');
  wm.set(_cache.moduleC, 'goodbye');
  wm.delete(_cache.moduleB);
  const values = [...wm];
  deepStrictEqual(values, ['hello', 'goodbye']);
}
{
  const wm = new IterableWeakMap();
  const _cache = {
    moduleA: {},
    moduleB: {},
    moduleC: {},
  };
  wm.set(_cache.moduleA, 'hello');
  wm.set(_cache.moduleB, 'discard');
  wm.set(_cache.moduleC, 'goodbye');
  strictEqual(wm.get(_cache.moduleB), 'discard');
}
{
  const wm = new IterableWeakMap();
  const _cache = {
    moduleA: {},
  };
  wm.set(_cache.moduleA, 'hello');
  strictEqual(wm.has(_cache.moduleA), true);
}
