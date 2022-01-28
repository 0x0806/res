'use strict';
const assert = require('assert');
const events = require('events');
function expect(expected) {
  const actual = [];
  process.on('exit', function() {
    assert.deepStrictEqual(actual.sort(), expected.sort());
  });
  function listener(name) {
    actual.push(name);
  }
  return common.mustCall(listener, expected.length);
}
{
  const ee = new events.EventEmitter();
  const noop = common.mustNotCall();
  ee.on('foo', noop);
  ee.on('bar', noop);
  ee.on('baz', noop);
  ee.on('baz', noop);
  const fooListeners = ee.listeners('foo');
  const barListeners = ee.listeners('bar');
  const bazListeners = ee.listeners('baz');
  ee.on('removeListener', expect(['bar', 'baz', 'baz']));
  ee.removeAllListeners('bar');
  ee.removeAllListeners('baz');
  assert.deepStrictEqual(ee.listeners('foo'), [noop]);
  assert.deepStrictEqual(ee.listeners('bar'), []);
  assert.deepStrictEqual(ee.listeners('baz'), []);
  assert.deepStrictEqual(fooListeners, [noop]);
  assert.deepStrictEqual(barListeners, [noop]);
  assert.deepStrictEqual(bazListeners, [noop, noop]);
  assert.notStrictEqual(ee.listeners('bar'), barListeners);
  assert.notStrictEqual(ee.listeners('baz'), bazListeners);
}
{
  const ee = new events.EventEmitter();
  ee.on('foo', common.mustNotCall());
  ee.on('bar', common.mustNotCall());
  ee.on('removeListener', expect(['foo', 'bar', 'removeListener']));
  ee.on('removeListener', expect(['foo', 'bar']));
  ee.removeAllListeners();
  assert.deepStrictEqual([], ee.listeners('foo'));
  assert.deepStrictEqual([], ee.listeners('bar'));
}
{
  const ee = new events.EventEmitter();
  ee.on('removeListener', common.mustNotCall());
  ee.removeAllListeners.bind(ee, 'foo');
}
{
  const ee = new events.EventEmitter();
  let expectLength = 2;
  ee.on('removeListener', function(name, noop) {
    assert.strictEqual(expectLength--, this.listeners('baz').length);
  });
  ee.on('baz', common.mustNotCall());
  ee.on('baz', common.mustNotCall());
  ee.on('baz', common.mustNotCall());
  assert.strictEqual(ee.listeners('baz').length, expectLength + 1);
  ee.removeAllListeners('baz');
  assert.strictEqual(ee.listeners('baz').length, 0);
}
{
  const ee = new events.EventEmitter();
  assert.deepStrictEqual(ee, ee.removeAllListeners());
}
{
  const ee = new events.EventEmitter();
  ee._events = undefined;
  assert.strictEqual(ee, ee.removeAllListeners());
}
{
  const ee = new events.EventEmitter();
  const symbol = Symbol('symbol');
  const noop = common.mustNotCall();
  ee.on(symbol, noop);
  ee.on('removeListener', common.mustCall((...args) => {
    assert.deepStrictEqual(args, [symbol, noop]);
  }));
  ee.removeAllListeners();
}
