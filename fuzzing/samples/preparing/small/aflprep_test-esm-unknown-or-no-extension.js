'use strict';
const { spawn } = require('child_process');
const assert = require('assert');
[
].forEach((fixturePath) => {
  const entry = fixtures.path(fixturePath);
  const child = spawn(process.execPath, [entry]);
  let stdout = '';
  let stderr = '';
  child.stderr.setEncoding('utf8');
  child.stdout.setEncoding('utf8');
  child.stdout.on('data', (data) => {
    stdout += data;
  });
  child.stderr.on('data', (data) => {
    stderr += data;
  });
  child.on('close', common.mustCall((code, signal) => {
    assert.strictEqual(code, 1);
    assert.strictEqual(signal, null);
    assert.strictEqual(stdout, '');
    assert.ok(stderr.indexOf('ERR_UNKNOWN_FILE_EXTENSION') !== -1);
  }));
});
