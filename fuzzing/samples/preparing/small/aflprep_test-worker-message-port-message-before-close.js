'use strict';
const assert = require('assert');
const { once } = require('events');
const { Worker, MessageChannel } = require('worker_threads');
async function test() {
  const worker = new Worker(`
  require('worker_threads').parentPort.on('message', ({ port }) => {
    port.postMessage('firstMessage');
    port.postMessage('lastMessage');
    port.close();
  });
  `, { eval: true });
  for (let i = 0; i < 10000; i++) {
    const { port1, port2 } = new MessageChannel();
    worker.postMessage({ port: port2 }, [ port2 ]);
    assert.deepStrictEqual(await once(port1, 'message'), ['firstMessage']);
    assert.deepStrictEqual(await once(port1, 'message'), ['lastMessage']);
  }
  await worker.terminate();
}
test().then(common.mustCall());
