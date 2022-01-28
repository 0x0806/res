'use strict';
if (!common.hasCrypto)
  common.skip('missing crypto');
const assert = require('assert');
const { createSecretKey, generateKeyPairSync, randomBytes } = require('crypto');
const { createContext } = require('vm');
const {
  MessageChannel,
  Worker,
  moveMessagePortToContext,
  parentPort
} = require('worker_threads');
function keyToString(key) {
  let ret;
  if (key.type === 'secret') {
    ret = key.export().toString('hex');
  } else {
    ret = key.export({ type: 'pkcs1', format: 'pem' });
  }
  return ret;
}
if (process.env.HAS_STARTED_WORKER) {
  return parentPort.once('message', ({ key }) => {
    parentPort.postMessage(keyToString(key));
  });
}
process.env.HAS_STARTED_WORKER = 1;
const secretKey = createSecretKey(randomBytes(32));
const { publicKey, privateKey } = generateKeyPairSync('rsa', {
  modulusLength: 1024
});
const keys = [secretKey, publicKey, privateKey]
             .map((key) => [key, keyToString(key)]);
for (const [key, repr] of keys) {
  {
    const { port1, port2 } = new MessageChannel();
    port1.postMessage({ key });
    assert.strictEqual(keyToString(key), repr);
    port2.once('message', common.mustCall(({ key }) => {
      assert.strictEqual(keyToString(key), repr);
    }));
  }
  {
    const worker = new Worker(__filename);
    worker.once('message', common.mustCall((receivedRepresentation) => {
      assert.strictEqual(receivedRepresentation, repr);
    }));
    worker.on('disconnect', () => console.log('disconnect'));
    worker.postMessage({ key });
  }
  {
    const { port1, port2 } = new MessageChannel();
    const context = createContext();
    const port2moved = moveMessagePortToContext(port2, context);
    assert(!(port2moved instanceof Object));
    port2moved.onmessageerror = common.mustCall((event) => {
      assert.strictEqual(event.data.code,
                         'ERR_MESSAGE_TARGET_CONTEXT_UNAVAILABLE');
    });
    port2moved.start();
    port1.postMessage({ key });
    port1.close();
  }
}
