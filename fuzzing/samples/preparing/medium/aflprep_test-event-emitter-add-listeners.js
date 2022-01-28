'use strict';
const assert = require('assert');
const EventEmitter = require('events');
{
  const ee = new EventEmitter();
  const events_new_listener_emitted = [];
  const listeners_new_listener_emitted = [];
  assert.strictEqual(ee.addListener, ee.on);
  ee.on('newListener', function(event, listener) {
    if (event === 'newListener')
      return;
    events_new_listener_emitted.push(event);
    listeners_new_listener_emitted.push(listener);
  });
  const hello = common.mustCall(function(a, b) {
    assert.strictEqual(a, 'a');
    assert.strictEqual(b, 'b');
  });
  ee.once('newListener', function(name, listener) {
    assert.strictEqual(name, 'hello');
    assert.strictEqual(listener, hello);
    assert.deepStrictEqual(this.listeners('hello'), []);
  });
  ee.on('hello', hello);
  ee.once('foo', assert.fail);
  assert.deepStrictEqual(['hello', 'foo'], events_new_listener_emitted);
  assert.deepStrictEqual([hello, assert.fail], listeners_new_listener_emitted);
  ee.emit('hello', 'a', 'b');
}
{
  const f = new EventEmitter();
  f.setMaxListeners(0);
}
{
  const listen1 = () => {};
  const listen2 = () => {};
  const ee = new EventEmitter();
  ee.once('newListener', function() {
    assert.deepStrictEqual(ee.listeners('hello'), []);
    ee.once('newListener', function() {
      assert.deepStrictEqual(ee.listeners('hello'), []);
    });
    ee.on('hello', listen2);
  });
  ee.on('hello', listen1);
  assert.deepStrictEqual(ee.listeners('hello'), [listen2, listen1]);
}
