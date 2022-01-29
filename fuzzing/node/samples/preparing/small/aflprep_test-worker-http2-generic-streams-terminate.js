'use strict';
if (!common.hasCrypto)
  common.skip('missing crypto');
const assert = require('assert');
const http2 = require('http2');
const { Duplex } = require('stream');
const { Worker, workerData } = require('worker_threads');
if (!workerData) {
  const counter = new Int32Array(new SharedArrayBuffer(4));
  const worker = new Worker(__filename, { workerData: { counter } });
  worker.on('exit', common.mustCall(() => {
    assert.strictEqual(counter[0], 1);
  }));
} else {
  const { counter } = workerData;
  for (let i = 0; i < 2; i++) {
      createConnection() {
        return new Duplex({
          write(chunk, enc, cb) {
            Atomics.add(counter, 0, 1);
            process.exit();
          },
          read() { }
        });
      }
    });
  }
}
