'use strict';
const assert = require('assert');
const fs = require('fs').promises;
const { MessageChannel } = require('worker_threads');
const { once } = require('events');
(async function() {
  const fh = await fs.open(__filename);
  assert.strictEqual(fh.constructor.name, 'FileHandle');
  const kTransfer = Object.getOwnPropertySymbols(Object.getPrototypeOf(fh))
    .filter((symbol) => symbol.description === 'messaging_transfer_symbol')[0];
  assert.strictEqual(typeof kTransfer, 'symbol');
  fh[kTransfer] = () => {
    return {
      data: '✨',
      deserializeInfo: 'net:Socket'
    };
  };
  const { port1, port2 } = new MessageChannel();
  port1.postMessage(fh, [ fh ]);
  port2.on('message', common.mustNotCall());
  const [ exception ] = await once(port2, 'messageerror');
  assert.strictEqual(exception.message, 'Unknown deserialize spec net:Socket');
  port2.close();
})().then(common.mustCall());
