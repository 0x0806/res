'use strict';
const dc = require('diagnostics_channel');
const assert = require('assert');
const { Channel } = dc;
const input = {
  foo: 'bar'
};
assert.ok(!dc.hasSubscribers('test'));
const channel = dc.channel('test');
assert.ok(channel instanceof Channel);
assert.ok(!channel.hasSubscribers);
const subscriber = common.mustCall((message, name) => {
  assert.strictEqual(name, channel.name);
  assert.deepStrictEqual(message, input);
});
channel.subscribe(subscriber);
assert.ok(channel.hasSubscribers);
assert.ok(channel instanceof Channel);
channel.publish(input);
channel.unsubscribe(subscriber);
assert.ok(!channel.hasSubscribers);
assert.throws(() => {
  channel.subscribe(null);
}, { code: 'ERR_INVALID_ARG_TYPE' });
