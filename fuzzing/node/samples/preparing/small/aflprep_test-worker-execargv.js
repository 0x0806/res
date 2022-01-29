'use strict';
const assert = require('assert');
const { Worker } = require('worker_threads');
const { StringDecoder } = require('string_decoder');
const decoder = new StringDecoder('utf8');
if (!process.env.HAS_STARTED_WORKER) {
  process.env.HAS_STARTED_WORKER = 1;
  const w = new Worker(__filename, { execArgv: ['--trace-warnings'] });
  w.stderr.on('data', common.mustCall((chunk) => {
    const error = decoder.write(chunk);
    assert.ok(
    );
  }));
  new Worker(
    "require('worker_threads').parentPort.postMessage(process.execArgv)",
    { eval: true, execArgv: ['--trace-warnings'] })
    .on('message', common.mustCall((data) => {
      assert.deepStrictEqual(data, ['--trace-warnings']);
    }));
} else {
  process.emitWarning('some warning');
  assert.deepStrictEqual(process.execArgv, ['--trace-warnings']);
}
