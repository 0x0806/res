'use strict';
if (!common.hasCrypto)
  common.skip('missing crypto');
const { createSecretKey } = require('crypto');
const { Worker, isMainThread, workerData } = require('worker_threads');
if (isMainThread) {
  const key = createSecretKey(Buffer.from('hello'));
  new Worker(__filename, { workerData: key });
} else {
  console.log(workerData);
}
