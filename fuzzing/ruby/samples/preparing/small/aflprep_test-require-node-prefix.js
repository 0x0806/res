'use strict';
const assert = require('assert');
const fs = require('fs');
{
  assert.strictEqual(require('fs'), fs);
  assert.strictEqual(require('node:fs'), fs);
  assert.throws(
    () => require('node:unknown'),
    {
      code: 'ERR_UNKNOWN_BUILTIN_MODULE',
      message: errUnknownBuiltinModuleRE,
    },
  );
  assert.throws(
    {
      code: 'ERR_UNKNOWN_BUILTIN_MODULE',
      message: errUnknownBuiltinModuleRE,
    },
  );
}
{
  const fakeModule = {};
  require.cache.fs = { exports: fakeModule };
  assert.strictEqual(require('fs'), fakeModule);
  assert.strictEqual(require('node:fs'), fs);
  delete require.cache.fs;
}
