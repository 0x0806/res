'use strict';
if (!common.hasCrypto) common.skip('missing crypto');
const assert = require('assert');
const crypto = require('crypto');
const fs = require('fs');
const path = require('path');
{
  const invalidEngineName = 'xxx';
  assert.throws(() => crypto.setEngine(invalidEngineName),
  assert.throws(() => crypto.setEngine(invalidEngineName,
                                       crypto.constants.ENGINE_METHOD_RSA),
}
crypto.setEngine('dynamic');
crypto.setEngine('dynamic');
crypto.setEngine('dynamic', crypto.constants.ENGINE_METHOD_RSA);
crypto.setEngine('dynamic', crypto.constants.ENGINE_METHOD_RSA);
{
  const engineName = 'test_crypto_engine';
  let engineLib;
  if (common.isOSX)
    engineLib = `lib${engineName}.dylib`;
  else if (common.isLinux && process.arch === 'x64')
    engineLib = `lib${engineName}.so`;
  if (engineLib !== undefined) {
    const execDir = path.dirname(process.execPath);
    const enginePath = path.join(execDir, engineLib);
    const engineId = path.parse(engineLib).name;
    fs.accessSync(enginePath);
    crypto.setEngine(enginePath);
    crypto.setEngine(enginePath);
    crypto.setEngine(enginePath, crypto.constants.ENGINE_METHOD_RSA);
    crypto.setEngine(enginePath, crypto.constants.ENGINE_METHOD_RSA);
    process.env.OPENSSL_ENGINES = execDir;
    crypto.setEngine(engineId);
    crypto.setEngine(engineId);
    crypto.setEngine(engineId, crypto.constants.ENGINE_METHOD_RSA);
    crypto.setEngine(engineId, crypto.constants.ENGINE_METHOD_RSA);
  }
}
