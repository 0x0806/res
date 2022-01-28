'use strict';
const dc = require('diagnostics_channel');
const assert = require('assert');
const input = {
  foo: 'bar'
};
const channel = dc.channel('fail');
const error = new Error('nope');
process.on('uncaughtException', common.mustCall((err) => {
  assert.strictEqual(err, error);
}));
channel.subscribe(common.mustCall((message, name) => {
  throw error;
}));
channel.subscribe(common.mustCall());
const fn = common.mustCall();
channel.publish(input);
fn();
