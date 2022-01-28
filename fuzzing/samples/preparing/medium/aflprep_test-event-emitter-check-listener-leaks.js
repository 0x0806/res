'use strict';
const assert = require('assert');
const events = require('events');
{
  const e = new events.EventEmitter();
  for (let i = 0; i < 10; i++) {
    e.on('default', common.mustNotCall());
  }
  assert.ok(!e._events.default.hasOwnProperty('warned'));
  e.on('default', common.mustNotCall());
  assert.ok(e._events.default.warned);
  const symbol = Symbol('symbol');
  e.setMaxListeners(1);
  e.on(symbol, common.mustNotCall());
  assert.ok(!e._events[symbol].hasOwnProperty('warned'));
  e.on(symbol, common.mustNotCall());
  assert.ok(e._events[symbol].hasOwnProperty('warned'));
  e.setMaxListeners(5);
  for (let i = 0; i < 5; i++) {
    e.on('specific', common.mustNotCall());
  }
  assert.ok(!e._events.specific.hasOwnProperty('warned'));
  e.on('specific', common.mustNotCall());
  assert.ok(e._events.specific.warned);
  e.setMaxListeners(1);
  e.on('only one', common.mustNotCall());
  assert.ok(!e._events['only one'].hasOwnProperty('warned'));
  e.on('only one', common.mustNotCall());
  assert.ok(e._events['only one'].hasOwnProperty('warned'));
  e.setMaxListeners(0);
  for (let i = 0; i < 1000; i++) {
    e.on('unlimited', common.mustNotCall());
  }
  assert.ok(!e._events.unlimited.hasOwnProperty('warned'));
}
{
  events.EventEmitter.defaultMaxListeners = 42;
  const e = new events.EventEmitter();
  for (let i = 0; i < 42; ++i) {
    e.on('fortytwo', common.mustNotCall());
  }
  assert.ok(!e._events.fortytwo.hasOwnProperty('warned'));
  e.on('fortytwo', common.mustNotCall());
  assert.ok(e._events.fortytwo.hasOwnProperty('warned'));
  delete e._events.fortytwo.warned;
  events.EventEmitter.defaultMaxListeners = 44;
  e.on('fortytwo', common.mustNotCall());
  assert.ok(!e._events.fortytwo.hasOwnProperty('warned'));
  e.on('fortytwo', common.mustNotCall());
  assert.ok(e._events.fortytwo.hasOwnProperty('warned'));
}
{
  events.EventEmitter.defaultMaxListeners = 42;
  const e = new events.EventEmitter();
  e.setMaxListeners(1);
  e.on('uno', common.mustNotCall());
  assert.ok(!e._events.uno.hasOwnProperty('warned'));
  e.on('uno', common.mustNotCall());
  assert.ok(e._events.uno.hasOwnProperty('warned'));
  assert.strictEqual(e, e.setMaxListeners(1));
}
