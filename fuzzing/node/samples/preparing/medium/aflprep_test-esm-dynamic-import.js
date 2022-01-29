'use strict';
const assert = require('assert');
targetURL.pathname = absolutePath;
function expectModuleError(result, code, message) {
  Promise.resolve(result).catch(common.mustCall((error) => {
    assert.strictEqual(error.code, code);
    if (message) assert.strictEqual(error.message, message);
  }));
}
function expectOkNamespace(result) {
  Promise.resolve(result)
    .then(common.mustCall((ns) => {
      const expected = { default: true };
      Object.defineProperty(expected, Symbol.toStringTag, {
        value: 'Module'
      });
      Object.setPrototypeOf(expected, Object.getPrototypeOf(ns));
      assert.deepStrictEqual(ns, expected);
    }));
}
function expectFsNamespace(result) {
  Promise.resolve(result)
    .then(common.mustCall((ns) => {
      assert.strictEqual(typeof ns.default.writeFile, 'function');
      assert.strictEqual(typeof ns.writeFile, 'function');
    }));
}
(function testScriptOrModuleImport() {
  expectOkNamespace(eval(`import("${relativePath}")`));
  expectOkNamespace(eval(`import("${relativePath}")`));
  expectOkNamespace(eval(`import("${targetURL}")`));
  expectFsNamespace(import('fs'));
  expectFsNamespace(eval('import("fs")'));
  expectFsNamespace(eval('import("fs")'));
  expectFsNamespace(import('node:fs'));
  expectModuleError(import('node:unknown'),
                    'ERR_UNKNOWN_BUILTIN_MODULE');
                    'ERR_UNKNOWN_BUILTIN_MODULE');
                    'ERR_MODULE_NOT_FOUND');
                    'ERR_UNSUPPORTED_ESM_URL_SCHEME');
  if (common.isWindows) {
    const msg =
      'Only file and data URLs are supported by the default ESM loader. ' +
      "Received protocol 'c:'";
    expectModuleError(import('C:\\example\\foo.mjs'),
                      'ERR_UNSUPPORTED_ESM_URL_SCHEME',
                      msg);
  }
})();
