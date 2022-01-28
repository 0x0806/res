'use strict';
const assert = require('assert');
const path = require('path');
const child_process = require('child_process');
tmpdir.refresh();
for (const NODE_V8_COVERAGE of ['', tmpdir.path]) {
  if (!process.features.inspector && NODE_V8_COVERAGE !== '') continue;
  const { status, signal, stdout, stderr } =
    child_process.spawnSync(process.execPath,
                            [path.join(__dirname, 'test-ttywrap-stack.js')],
                            { env: { ...process.env, NODE_V8_COVERAGE } });
  assert(stdout.toString('utf8')
         .startsWith('RangeError: Maximum call stack size exceeded'),
         `stdout: <${stdout}>`);
  assert(stderr.toString('utf8')
         .startsWith('Exception in PromiseRejectCallback'),
         `stderr: <${stderr}>`);
  assert.strictEqual(status, 0);
  assert.strictEqual(signal, null);
}
