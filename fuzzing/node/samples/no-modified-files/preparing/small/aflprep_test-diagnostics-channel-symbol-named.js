'use strict';
const dc = require('diagnostics_channel');
const assert = require('assert');
const input = {
  foo: 'bar'
};
const symbol = Symbol('test');
const channel = dc.channel(symbol);
channel.subscribe(common.mustCall((message, name) => {
  assert.strictEqual(name, symbol);
  assert.deepStrictEqual(message, input);
}));
channel.publish(input);
{
  assert.throws(() => {
    dc.channel(null);
}
