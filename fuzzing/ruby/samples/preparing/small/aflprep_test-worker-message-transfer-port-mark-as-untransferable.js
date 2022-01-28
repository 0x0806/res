'use strict';
const assert = require('assert');
const { MessageChannel, markAsUntransferable } = require('worker_threads');
{
  const ab = new ArrayBuffer(8);
  markAsUntransferable(ab);
  assert.strictEqual(ab.byteLength, 8);
  const { port1, port2 } = new MessageChannel();
  port1.postMessage(ab, [ ab ]);
  port2.once('message', common.mustCall());
}
{
  const channel1 = new MessageChannel();
  const channel2 = new MessageChannel();
  markAsUntransferable(channel2.port1);
  assert.throws(() => {
    channel1.port1.postMessage(channel2.port1, [ channel2.port1 ]);
  channel2.port2.once('message', common.mustCall());
}
{
  for (const value of [0, null, false, true, undefined, [], {}]) {
  }
}
