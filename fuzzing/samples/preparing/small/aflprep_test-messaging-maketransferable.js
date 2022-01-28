'use strict';
const assert = require('assert');
const {
  JSTransferable,
const mc = new MessageChannel();
mc.port1.onmessageerror = common.mustNotCall();
mc.port1.onmessage = common.mustCall(({ data }) => {
  assert(!(data instanceof JSTransferable));
  assert(data instanceof F);
  assert(data instanceof E);
  assert.strictEqual(data.b, 1);
  mc.port1.close();
});
mc.port2.postMessage(new F(1));
