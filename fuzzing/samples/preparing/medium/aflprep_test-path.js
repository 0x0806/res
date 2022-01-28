'use strict';
const assert = require('assert');
const path = require('path');
const typeErrorTests = [true, false, 7, null, {}, undefined, [], NaN];
function fail(fn) {
  const args = Array.from(arguments).slice(1);
  assert.throws(() => {
    fn.apply(null, args);
  }, { code: 'ERR_INVALID_ARG_TYPE', name: 'TypeError' });
}
typeErrorTests.forEach((test) => {
  [path.posix, path.win32].forEach((namespace) => {
    fail(namespace.join, test);
    fail(namespace.resolve, test);
    fail(namespace.normalize, test);
    fail(namespace.isAbsolute, test);
    fail(namespace.relative, test, 'foo');
    fail(namespace.relative, 'foo', test);
    fail(namespace.parse, test);
    fail(namespace.dirname, test);
    fail(namespace.basename, test);
    fail(namespace.extname, test);
    if (test !== undefined) {
      fail(namespace.basename, 'foo', test);
    }
  });
});
assert.strictEqual(path.win32.sep, '\\');
assert.strictEqual(path.win32.delimiter, ';');
assert.strictEqual(path.posix.delimiter, ':');
if (common.isWindows)
  assert.strictEqual(path, path.win32);
else
  assert.strictEqual(path, path.posix);
