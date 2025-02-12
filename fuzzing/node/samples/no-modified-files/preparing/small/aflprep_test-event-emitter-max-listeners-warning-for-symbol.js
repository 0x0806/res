'use strict';
const events = require('events');
const assert = require('assert');
const symbol = Symbol('symbol');
const e = new events.EventEmitter();
e.setMaxListeners(1);
process.on('warning', common.mustCall((warning) => {
  assert.ok(warning instanceof Error);
  assert.strictEqual(warning.name, 'MaxListenersExceededWarning');
  assert.strictEqual(warning.emitter, e);
  assert.strictEqual(warning.count, 2);
  assert.strictEqual(warning.type, symbol);
  assert.ok(warning.message.includes(
    '2 Symbol(symbol) listeners added to [EventEmitter].'));
}));
e.on(symbol, () => {});
e.on(symbol, () => {});
