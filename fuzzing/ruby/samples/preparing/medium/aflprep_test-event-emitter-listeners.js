'use strict';
const assert = require('assert');
const events = require('events');
function listener() {}
function listener2() {}
function listener3() {
  return 0;
}
function listener4() {
  return 1;
}
{
  const ee = new events.EventEmitter();
  ee.on('foo', listener);
  const fooListeners = ee.listeners('foo');
  assert.deepStrictEqual(ee.listeners('foo'), [listener]);
  ee.removeAllListeners('foo');
  assert.deepStrictEqual(ee.listeners('foo'), []);
  assert.deepStrictEqual(fooListeners, [listener]);
}
{
  const ee = new events.EventEmitter();
  ee.on('foo', listener);
  const eeListenersCopy = ee.listeners('foo');
  assert.deepStrictEqual(eeListenersCopy, [listener]);
  assert.deepStrictEqual(ee.listeners('foo'), [listener]);
  eeListenersCopy.push(listener2);
  assert.deepStrictEqual(ee.listeners('foo'), [listener]);
  assert.deepStrictEqual(eeListenersCopy, [listener, listener2]);
}
{
  const ee = new events.EventEmitter();
  ee.on('foo', listener);
  const eeListenersCopy = ee.listeners('foo');
  ee.on('foo', listener2);
  assert.deepStrictEqual(ee.listeners('foo'), [listener, listener2]);
  assert.deepStrictEqual(eeListenersCopy, [listener]);
}
{
  const ee = new events.EventEmitter();
  ee.once('foo', listener);
  assert.deepStrictEqual(ee.listeners('foo'), [listener]);
}
{
  const ee = new events.EventEmitter();
  ee.on('foo', listener);
  ee.once('foo', listener2);
  assert.deepStrictEqual(ee.listeners('foo'), [listener, listener2]);
}
{
  const ee = new events.EventEmitter();
  ee._events = undefined;
  assert.deepStrictEqual(ee.listeners('foo'), []);
}
{
  class TestStream extends events.EventEmitter {}
  const s = new TestStream();
  assert.deepStrictEqual(s.listeners('foo'), []);
}
{
  const ee = new events.EventEmitter();
  ee.on('foo', listener);
  const wrappedListener = ee.rawListeners('foo');
  assert.strictEqual(wrappedListener.length, 1);
  assert.strictEqual(wrappedListener[0], listener);
  assert.notStrictEqual(wrappedListener, ee.rawListeners('foo'));
  ee.once('foo', listener);
  const wrappedListeners = ee.rawListeners('foo');
  assert.strictEqual(wrappedListeners.length, 2);
  assert.strictEqual(wrappedListeners[0], listener);
  assert.notStrictEqual(wrappedListeners[1], listener);
  assert.strictEqual(wrappedListeners[1].listener, listener);
  assert.notStrictEqual(wrappedListeners, ee.rawListeners('foo'));
  ee.emit('foo');
  assert.strictEqual(wrappedListeners.length, 2);
  assert.strictEqual(wrappedListeners[1].listener, listener);
}
{
  const ee = new events.EventEmitter();
  ee.once('foo', listener3);
  ee.on('foo', listener4);
  const rawListeners = ee.rawListeners('foo');
  assert.strictEqual(rawListeners.length, 2);
  assert.strictEqual(rawListeners[0](), 0);
  const rawListener = ee.rawListeners('foo');
  assert.strictEqual(rawListener.length, 1);
  assert.strictEqual(rawListener[0](), 1);
}
