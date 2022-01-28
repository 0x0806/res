'use strict';
const cp = require('child_process');
const assert = require('assert');
const opts = { shell: common.isWindows };
const p = cp.spawn('echo', [], opts);
p.on('close', common.mustCall((code, signal) => {
  assert.strictEqual(code, 0);
  assert.strictEqual(signal, null);
  spawnWithReadable();
}));
p.stdout.read();
const spawnWithReadable = () => {
  const buffer = [];
  const p = cp.spawn('echo', ['123'], opts);
  p.on('close', common.mustCall((code, signal) => {
    assert.strictEqual(code, 0);
    assert.strictEqual(signal, null);
    assert.strictEqual(Buffer.concat(buffer).toString().trim(), '123');
  }));
  p.stdout.on('readable', () => {
    let buf;
    while (buf = p.stdout.read())
      buffer.push(buf);
  });
};
