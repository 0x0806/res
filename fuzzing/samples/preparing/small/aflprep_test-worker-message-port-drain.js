'use strict';
const assert = require('assert');
const {
  Worker,
  isMainThread,
  parentPort,
  threadId,
} = require('worker_threads');
if (isMainThread) {
  const workerIdsToOutput = new Map();
  for (let i = 0; i < 2; i++) {
    const worker = new Worker(__filename, { stdout: true });
    const workerOutput = [];
    workerIdsToOutput.set(worker.threadId, workerOutput);
    worker.on('message', console.log);
    worker.stdout.on('data', (chunk) => {
      workerOutput.push(chunk.toString().trim());
    });
  }
  process.on('exit', () => {
    for (const [threadId, workerOutput] of workerIdsToOutput) {
      assert.ok(workerOutput.includes(`1 threadId: ${threadId}`));
      assert.ok(workerOutput.includes(`2 threadId: ${threadId}`));
    }
  });
} else {
  console.log(`1 threadId: ${threadId}`);
  console.log(`2 threadId: ${threadId}`);
  parentPort.postMessage(Array(100).fill(1));
}
