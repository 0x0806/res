'use strict';
const assert = require('assert');
function testFirstInPath(moduleName, isLocalModule) {
  const assertFunction = isLocalModule ?
    assert.strictEqual :
    assert.notStrictEqual;
  let paths = _module._resolveLookupPaths(moduleName);
  assertFunction(paths[0], '.');
  paths = _module._resolveLookupPaths(moduleName, null);
  assertFunction(paths && paths[0], '.');
}
testFirstInPath('.\\lodash', common.isWindows);
