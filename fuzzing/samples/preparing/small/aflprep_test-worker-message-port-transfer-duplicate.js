'use strict';
const assert = require('assert');
const { MessageChannel } = require('worker_threads');
{
  const { port1, port2 } = new MessageChannel();
  port2.once('message', common.mustNotCall());
  const port3 = new MessageChannel().port1;
  assert.throws(() => {
    port1.postMessage(port3, [port3, port3]);
  port1.close();
}
{
  const { port1, port2 } = new MessageChannel();
  port2.once('message', common.mustNotCall());
  const buf = new Uint8Array(10);
  assert.throws(() => {
    port1.postMessage(buf, [buf.buffer, buf.buffer]);
  port1.close();
}
