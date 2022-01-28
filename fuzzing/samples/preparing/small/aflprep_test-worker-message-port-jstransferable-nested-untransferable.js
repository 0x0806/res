'use strict';
const assert = require('assert');
const {
  JSTransferable, kTransfer, kTransferList
const { MessageChannel } = require('worker_threads');
class OuterTransferable extends JSTransferable {
  constructor() {
    super();
    const c = new MessageChannel();
    this.inner = c.port1;
    c.port2.postMessage(this.inner, [ this.inner ]);
  }
  [kTransferList] = common.mustCall(() => {
    return [ this.inner ];
  });
  [kTransfer] = common.mustCall(() => {
    return {
      data: { inner: this.inner },
      deserializeInfo: 'does-not:matter'
    };
  });
}
const { port1 } = new MessageChannel();
const ot = new OuterTransferable();
assert.throws(() => {
  port1.postMessage(ot, [ot]);
}, { name: 'DataCloneError' });
