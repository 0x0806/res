'use strict';
const assert = require('assert');
const fork = require('child_process').fork;
function message(name) {
  return `${name} did not affect getOptionValue('--pending-deprecation')`;
}
switch (process.argv[2]) {
  case 'env':
  case 'switch':
    assert.strictEqual(
      getOptionValue('--pending-deprecation'),
      true
    );
    break;
  default:
    const envvar = process.env.NODE_PENDING_DEPRECATION;
    assert.strictEqual(
      getOptionValue('--pending-deprecation'),
      !!(envvar && envvar[0] === '1')
    );
    fork(__filename, ['switch'], {
      execArgv: ['--pending-deprecation', '--expose-internals'],
      silent: true
    }).on('exit', common.mustCall((code) => {
      assert.strictEqual(code, 0, message('--pending-deprecation'));
    }));
    fork(__filename, ['switch'], {
      execArgv: ['--pending_deprecation', '--expose-internals'],
      silent: true
    }).on('exit', common.mustCall((code) => {
      assert.strictEqual(code, 0, message('--pending_deprecation'));
    }));
    fork(__filename, ['env'], {
      env: { ...process.env, NODE_PENDING_DEPRECATION: 1 },
      execArgv: ['--expose-internals'],
      silent: true
    }).on('exit', common.mustCall((code) => {
      assert.strictEqual(code, 0, message('NODE_PENDING_DEPRECATION'));
    }));
}
