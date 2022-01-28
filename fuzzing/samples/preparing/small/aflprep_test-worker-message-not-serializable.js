'use strict';
const assert = require('assert');
const { Worker } = require('worker_threads');
const worker = new Worker(`
  const { getEnvMessagePort } = internalBinding('worker');
  const messagePort = getEnvMessagePort();
  messagePort.postMessage({ type: messageTypes.COULD_NOT_SERIALIZE_ERROR });
`, { eval: true });
worker.on('error', common.mustCall((e) => {
  assert.strictEqual(e.code, 'ERR_WORKER_UNSERIALIZABLE_ERROR');
}));
