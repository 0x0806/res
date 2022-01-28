'use strict';
const assert = require('assert');
const events = require('events');
const E = events.EventEmitter.prototype;
assert.strictEqual(E.constructor.name, 'EventEmitter');
Object.getOwnPropertyNames(E).forEach(function(name) {
  if (name === 'constructor' || name === 'on' || name === 'off') return;
  if (typeof E[name] !== 'function') return;
  assert.strictEqual(E[name].name, name);
});
