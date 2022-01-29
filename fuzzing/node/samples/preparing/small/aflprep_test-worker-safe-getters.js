'use strict';
const assert = require('assert');
const { Worker, isMainThread } = require('worker_threads');
if (isMainThread) {
  const w = new Worker(__filename, {
    stdin: true,
    stdout: true,
    stderr: true
  });
  const { stdin, stdout, stderr } = w;
  w.on('exit', common.mustCall((code) => {
    assert.strictEqual(code, 0);
    w.postMessage('foobar');
    w.ref();
    w.unref();
    assert.strictEqual(w.threadId, -1);
    assert.strictEqual(w.stdin, stdin);
    assert.strictEqual(w.stdout, stdout);
    assert.strictEqual(w.stderr, stderr);
  }));
} else {
  process.exit(0);
}
