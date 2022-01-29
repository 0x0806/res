'use strict';
if (!common.hasCrypto)
  common.skip('missing crypto');
const assert = require('assert');
const spawnSync = require('child_process').spawnSync;
const path = require('path');
const { testFipsCrypto } = internalBinding('crypto');
const FIPS_ENABLED = 1;
const FIPS_DISABLED = 0;
const FIPS_ERROR_STRING2 =
  'Error [ERR_CRYPTO_FIPS_FORCED]: Cannot set FIPS mode, it was forced with ' +
  '--force-fips at startup.';
const FIPS_UNSUPPORTED_ERROR_STRING = 'fips mode not supported';
const FIPS_ENABLE_ERROR_STRING = 'OpenSSL error when trying to enable FIPS:';
const CNF_FIPS_ON = fixtures.path('openssl_fips_enabled.cnf');
const CNF_FIPS_OFF = fixtures.path('openssl_fips_disabled.cnf');
let num_children_ok = 0;
function sharedOpenSSL() {
  return process.config.variables.node_shared_openssl;
}
function testHelper(stream, args, expectedOutput, cmd, env) {
  const fullArgs = args.concat(['-e', `console.log(${cmd})`]);
  const child = spawnSync(process.execPath, fullArgs, {
    cwd: path.dirname(process.execPath),
    env: env
  });
  console.error(
    `Spawned child [pid:${child.pid}] with cmd '${cmd}' expect %j with args '${
      args}' OPENSSL_CONF=%j`, expectedOutput, env.OPENSSL_CONF);
  function childOk(child) {
    console.error(`Child #${++num_children_ok} [pid:${child.pid}] OK.`);
  }
  function responseHandler(buffer, expectedOutput) {
    const response = buffer.toString();
    assert.notStrictEqual(response.length, 0);
    if (FIPS_ENABLED !== expectedOutput && FIPS_DISABLED !== expectedOutput) {
      assert.ok(response.includes(expectedOutput));
    } else {
      const getFipsValue = Number(response);
      if (!Number.isNaN(getFipsValue))
        assert.strictEqual(getFipsValue, expectedOutput);
    }
    childOk(child);
  }
  responseHandler(child[stream], expectedOutput);
}
testHelper(
  testFipsCrypto() ? 'stdout' : 'stderr',
  ['--enable-fips'],
  testFipsCrypto() ? FIPS_ENABLED : FIPS_ENABLE_ERROR_STRING,
  'process.versions',
  process.env);
testHelper(
  testFipsCrypto() ? 'stdout' : 'stderr',
  ['--force-fips'],
  testFipsCrypto() ? FIPS_ENABLED : FIPS_ENABLE_ERROR_STRING,
  'process.versions',
  process.env);
testHelper(
  'stdout',
  [],
  FIPS_DISABLED,
  'require("crypto").getFips()',
  { ...process.env, 'OPENSSL_CONF': '' });
const test_result = testFipsCrypto();
assert.ok(test_result === 1 || test_result === 0);
if (!sharedOpenSSL() && !common.hasOpenSSL3) {
  testHelper(
    'stdout',
    [`--openssl-config=${CNF_FIPS_ON}`],
    testFipsCrypto() ? FIPS_ENABLED : FIPS_DISABLED,
    'require("crypto").getFips()',
    process.env);
  testHelper(
    'stdout',
    [],
    testFipsCrypto() ? FIPS_ENABLED : FIPS_DISABLED,
    'require("crypto").getFips()',
    Object.assign({}, process.env, { 'OPENSSL_CONF': CNF_FIPS_ON }));
  testHelper(
    'stdout',
    [`--openssl-config=${CNF_FIPS_ON}`],
    testFipsCrypto() ? FIPS_ENABLED : FIPS_DISABLED,
    'require("crypto").getFips()',
    Object.assign({}, process.env, { 'OPENSSL_CONF': CNF_FIPS_OFF }));
}
if (!common.hasOpenSSL3) {
  testHelper(
    'stdout',
    [`--openssl-config=${CNF_FIPS_OFF}`],
    FIPS_DISABLED,
    'require("crypto").getFips()',
    Object.assign({}, process.env, { 'OPENSSL_CONF': CNF_FIPS_ON }));
  testHelper(
    testFipsCrypto() ? 'stdout' : 'stderr',
    ['--enable-fips', `--openssl-config=${CNF_FIPS_OFF}`],
    testFipsCrypto() ? FIPS_ENABLED : FIPS_UNSUPPORTED_ERROR_STRING,
    'require("crypto").getFips()',
    process.env);
  testHelper(
    testFipsCrypto() ? 'stdout' : 'stderr',
    ['--force-fips', `--openssl-config=${CNF_FIPS_OFF}`],
    testFipsCrypto() ? FIPS_ENABLED : FIPS_UNSUPPORTED_ERROR_STRING,
    'require("crypto").getFips()',
    process.env);
  testHelper(
    testFipsCrypto() ? 'stdout' : 'stderr',
    ['--enable-fips'],
    testFipsCrypto() ? FIPS_ENABLED : FIPS_UNSUPPORTED_ERROR_STRING,
    'require("crypto").getFips()',
    process.env);
  testHelper(
    testFipsCrypto() ? 'stdout' : 'stderr',
    ['--force-fips'],
    testFipsCrypto() ? FIPS_ENABLED : FIPS_UNSUPPORTED_ERROR_STRING,
    'require("crypto").getFips()',
    process.env);
  testHelper(
    testFipsCrypto() ? 'stdout' : 'stderr',
    ['--enable-fips'],
    testFipsCrypto() ? FIPS_ENABLED : FIPS_UNSUPPORTED_ERROR_STRING,
    'require("crypto").getFips()',
    Object.assign({}, process.env, { 'OPENSSL_CONF': CNF_FIPS_OFF }));
  testHelper(
    testFipsCrypto() ? 'stdout' : 'stderr',
    ['--force-fips'],
    testFipsCrypto() ? FIPS_ENABLED : FIPS_UNSUPPORTED_ERROR_STRING,
    'require("crypto").getFips()',
    Object.assign({}, process.env, { 'OPENSSL_CONF': CNF_FIPS_OFF }));
  testHelper(
    testFipsCrypto() ? 'stdout' : 'stderr',
    [],
    testFipsCrypto() ? FIPS_ENABLED : FIPS_UNSUPPORTED_ERROR_STRING,
    '(require("crypto").setFips(true),' +
    'require("crypto").getFips())',
    process.env);
  testHelper(
    testFipsCrypto() ? 'stdout' : 'stderr',
    [],
    testFipsCrypto() ? FIPS_DISABLED : FIPS_UNSUPPORTED_ERROR_STRING,
    '(require("crypto").setFips(true),' +
    'require("crypto").setFips(false),' +
    'require("crypto").getFips())',
    process.env);
  testHelper(
    testFipsCrypto() ? 'stdout' : 'stderr',
    [`--openssl-config=${CNF_FIPS_OFF}`],
    testFipsCrypto() ? FIPS_ENABLED : FIPS_UNSUPPORTED_ERROR_STRING,
    '(require("crypto").setFips(true),' +
    'require("crypto").getFips())',
    process.env);
  testHelper(
    'stdout',
    [`--openssl-config=${CNF_FIPS_ON}`],
    FIPS_DISABLED,
    '(require("crypto").setFips(false),' +
    'require("crypto").getFips())',
    process.env);
  testHelper(
    testFipsCrypto() ? 'stdout' : 'stderr',
    ['--enable-fips'],
    testFipsCrypto() ? FIPS_DISABLED : FIPS_UNSUPPORTED_ERROR_STRING,
    '(require("crypto").setFips(false),' +
    'require("crypto").getFips())',
    process.env);
  testHelper(
    'stderr',
    ['--force-fips'],
    testFipsCrypto() ? FIPS_ERROR_STRING2 : FIPS_UNSUPPORTED_ERROR_STRING,
    'require("crypto").setFips(false)',
    process.env);
  testHelper(
    testFipsCrypto() ? 'stdout' : 'stderr',
    ['--force-fips'],
    testFipsCrypto() ? FIPS_ENABLED : FIPS_UNSUPPORTED_ERROR_STRING,
    '(require("crypto").setFips(true),' +
    'require("crypto").getFips())',
    process.env);
  testHelper(
    'stderr',
    ['--force-fips', '--enable-fips'],
    testFipsCrypto() ? FIPS_ERROR_STRING2 : FIPS_UNSUPPORTED_ERROR_STRING,
    'require("crypto").setFips(false)',
    process.env);
  testHelper(
    'stderr',
    ['--enable-fips', '--force-fips'],
    testFipsCrypto() ? FIPS_ERROR_STRING2 : FIPS_UNSUPPORTED_ERROR_STRING,
    'require("crypto").setFips(false)',
    process.env);
}
