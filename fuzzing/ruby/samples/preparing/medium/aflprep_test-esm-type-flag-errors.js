'use strict';
const assert = require('assert');
const exec = require('child_process').execFile;
const packageWithoutTypeMain =
const packageTypeCommonJsMain =
const packageTypeModuleMain =
expect('', mjsFile, '.mjs file');
expect('', cjsFile, '.cjs file');
expect('', packageTypeModuleMain, 'package-type-module');
expect('', packageTypeCommonJsMain, 'package-type-commonjs');
expect('', packageWithoutTypeMain, 'package-without-type');
expect('--input-type=module', packageTypeModuleMain,
       'ERR_INPUT_TYPE_NOT_ALLOWED', true);
try {
  assert.fail('Expected CJS to fail loading from type: module package.');
} catch (e) {
  assert.strictEqual(e.name, 'Error');
  assert.strictEqual(e.code, 'ERR_REQUIRE_ESM');
}
function expect(opt = '', inputFile, want, wantsError = false) {
  const argv = [inputFile];
  const opts = {
    env: Object.assign({}, process.env, { NODE_OPTIONS: opt }),
    maxBuffer: 1e6,
  };
  exec(process.execPath, argv, opts, common.mustCall((err, stdout, stderr) => {
    if (wantsError) {
      stdout = stderr;
    } else {
      assert.ifError(err);
    }
    if (stdout.includes(want)) return;
    const o = JSON.stringify(opt);
    assert.fail(`For ${o}, failed to find ${want} in: <\n${stdout}\n>`);
  }));
}
