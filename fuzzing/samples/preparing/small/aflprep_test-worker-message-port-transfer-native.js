'use strict';
const assert = require('assert');
const { MessageChannel } = require('worker_threads');
{
  const { port1, port2 } = new MessageChannel();
  port2.once('message', common.mustNotCall());
  assert.throws(() => {
    port1.postMessage(function foo() {});
  }, {
    name: 'DataCloneError',
  });
  port1.close();
}
{
  const { port1, port2 } = new MessageChannel();
  port2.once('message', common.mustNotCall());
  const nativeObject = new (internalBinding('js_stream').JSStream)();
  assert.throws(() => {
    port1.postMessage(nativeObject);
  }, {
    name: 'DataCloneError',
  });
  port1.close();
}
