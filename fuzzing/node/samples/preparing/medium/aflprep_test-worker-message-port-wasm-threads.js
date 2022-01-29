'use strict';
const assert = require('assert');
const { MessageChannel, Worker } = require('worker_threads');
const wasmSource = fixtures.readSync('shared-memory.wasm');
const wasmModule = new WebAssembly.Module(wasmSource);
const instance = new WebAssembly.Instance(wasmModule);
const { buffer } = instance.exports.memory;
assert(buffer instanceof SharedArrayBuffer);
{
  const { port1, port2 } = new MessageChannel();
  port1.postMessage(buffer);
  port2.once('message', common.mustCall((buffer2) => {
    const expected = 'Hello, world!';
    const bytes = Buffer.from(buffer).write(expected);
    const deserialized = Buffer.from(buffer2).toString('utf8', 0, bytes);
    assert.deepStrictEqual(deserialized, expected);
  }));
}
{
  const worker = new Worker(`
  const { parentPort } = require('worker_threads');
  const wasmSource = new Uint8Array([${wasmSource.join(',')}]);
  const wasmModule = new WebAssembly.Module(wasmSource);
  const instance = new WebAssembly.Instance(wasmModule);
  parentPort.postMessage(instance.exports.memory);
  parentPort.once('message', ({ wasmModule }) => {
    const instance = new WebAssembly.Instance(wasmModule);
    parentPort.postMessage(instance.exports.memory);
  });
  `, { eval: true });
  worker.on('message', common.mustCall(({ buffer }) => {
    assert(buffer instanceof SharedArrayBuffer);
  }, 2));
  worker.once('exit', common.mustCall());
  worker.postMessage({ wasmModule });
}
