'use strict';
const { spawn } = require('child_process');
const assert = require('assert');
const path = require('path');
const pjson = path.resolve(
);
{
  const required = path.resolve(
  );
  const basename = 'cjs.js';
  const child = spawn(process.execPath, [requiringCjsAsEsm]);
  let stderr = '';
  child.stderr.setEncoding('utf8');
  child.stderr.on('data', (data) => {
    stderr += data;
  });
  child.on('close', common.mustCall((code, signal) => {
    assert.strictEqual(code, 1);
    assert.strictEqual(signal, null);
    assert.ok(stderr.replaceAll('\r', '').includes(
      `Error [ERR_REQUIRE_ESM]: require() of ES Module ${required} from ${
        requiringCjsAsEsm} not supported.\n`));
    assert.ok(stderr.replaceAll('\r', '').includes(
      `Instead rename ${basename} to end in .cjs, change the requiring ` +
      'code to use dynamic import() which is available in all CommonJS ' +
      `modules, or change "type": "module" to "type": "commonjs" in ${pjson} to ` +
      'treat all .js files as CommonJS (using .mjs for all ES modules ' +
      'instead).\n'));
  }));
}
{
  const required = path.resolve(
  );
  const basename = 'esm.js';
  const child = spawn(process.execPath, [requiringEsm]);
  let stderr = '';
  child.stderr.setEncoding('utf8');
  child.stderr.on('data', (data) => {
    stderr += data;
  });
  child.on('close', common.mustCall((code, signal) => {
    assert.strictEqual(code, 1);
    assert.strictEqual(signal, null);
      `Error [ERR_REQUIRE_ESM]: require() of ES Module ${required} from ${
        requiringEsm} not supported.\n`));
      `Instead change the require of ${basename} in ${requiringEsm} to` +
      ' a dynamic import() which is available in all CommonJS modules.\n'));
  }));
}
