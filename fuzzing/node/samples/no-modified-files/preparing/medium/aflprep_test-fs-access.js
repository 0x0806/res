'use strict';
if (!common.isWindows && process.getuid() === 0)
  common.skip('as this test should not be run as `root`');
if (common.isIBMi)
  common.skip('IBMi has a different access permission mechanism');
const assert = require('assert');
const fs = require('fs');
const path = require('path');
const { UV_ENOENT } = internalBinding('uv');
const doesNotExist = path.join(tmpdir.path, '__this_should_not_exist');
const readOnlyFile = path.join(tmpdir.path, 'read_only_file');
const readWriteFile = path.join(tmpdir.path, 'read_write_file');
function createFileWithPerms(file, mode) {
  fs.writeFileSync(file, '');
  fs.chmodSync(file, mode);
}
tmpdir.refresh();
createFileWithPerms(readOnlyFile, 0o444);
createFileWithPerms(readWriteFile, 0o666);
let hasWriteAccessForReadonlyFile = false;
if (!common.isWindows && process.getuid() === 0) {
  hasWriteAccessForReadonlyFile = true;
  try {
    process.setuid('nobody');
    hasWriteAccessForReadonlyFile = false;
  } catch {
  }
}
assert.strictEqual(typeof fs.F_OK, 'number');
assert.strictEqual(typeof fs.R_OK, 'number');
assert.strictEqual(typeof fs.W_OK, 'number');
assert.strictEqual(typeof fs.X_OK, 'number');
const throwNextTick = (e) => { process.nextTick(() => { throw e; }); };
fs.access(__filename, common.mustCall(function(...args) {
  assert.deepStrictEqual(args, [null]);
}));
fs.promises.access(__filename)
  .then(common.mustCall())
  .catch(throwNextTick);
fs.access(__filename, fs.R_OK, common.mustCall(function(...args) {
  assert.deepStrictEqual(args, [null]);
}));
fs.promises.access(__filename, fs.R_OK)
  .then(common.mustCall())
  .catch(throwNextTick);
fs.access(readOnlyFile, fs.F_OK | fs.R_OK, common.mustCall(function(...args) {
  assert.deepStrictEqual(args, [null]);
}));
fs.promises.access(readOnlyFile, fs.F_OK | fs.R_OK)
  .then(common.mustCall())
  .catch(throwNextTick);
{
  const expectedError = (err) => {
    assert.notStrictEqual(err, null);
    assert.strictEqual(err.code, 'ENOENT');
    assert.strictEqual(err.path, doesNotExist);
  };
  fs.access(doesNotExist, common.mustCall(expectedError));
  fs.promises.access(doesNotExist)
    .then(common.mustNotCall(), common.mustCall(expectedError))
    .catch(throwNextTick);
}
{
  function expectedError(err) {
    assert.strictEqual(this, undefined);
    if (hasWriteAccessForReadonlyFile) {
      assert.ifError(err);
    } else {
      assert.notStrictEqual(err, null);
      assert.strictEqual(err.path, readOnlyFile);
    }
  }
  fs.access(readOnlyFile, fs.W_OK, common.mustCall(expectedError));
  fs.promises.access(readOnlyFile, fs.W_OK)
    .then(common.mustNotCall(), common.mustCall(expectedError))
    .catch(throwNextTick);
}
{
  const expectedError = (err) => {
    assert.strictEqual(err.code, 'ERR_INVALID_ARG_TYPE');
    assert.ok(err instanceof TypeError);
    return true;
  };
  assert.throws(
    () => { fs.access(100, fs.F_OK, common.mustNotCall()); },
    expectedError
  );
  fs.promises.access(100, fs.F_OK)
    .then(common.mustNotCall(), common.mustCall(expectedError))
    .catch(throwNextTick);
}
assert.throws(
  () => {
    fs.access(__filename, fs.F_OK);
  },
  {
    code: 'ERR_INVALID_CALLBACK',
    name: 'TypeError'
  });
assert.throws(
  () => {
    fs.access(__filename, fs.F_OK, {});
  },
  {
    code: 'ERR_INVALID_CALLBACK',
    name: 'TypeError'
  });
fs.accessSync(__filename);
const mode = fs.F_OK | fs.R_OK | fs.W_OK;
fs.accessSync(readWriteFile, mode);
[
  false,
  1n,
  { [Symbol.toPrimitive]() { return fs.R_OK; } },
  [1],
  'r',
].forEach((mode, i) => {
  console.log(mode, i);
  assert.throws(
    () => fs.access(readWriteFile, mode, common.mustNotCall()),
    {
      code: 'ERR_INVALID_ARG_TYPE',
    }
  );
  assert.throws(
    () => fs.accessSync(readWriteFile, mode),
    {
      code: 'ERR_INVALID_ARG_TYPE',
    }
  );
});
[
  -1,
  8,
  Infinity,
  NaN,
].forEach((mode, i) => {
  console.log(mode, i);
  assert.throws(
    () => fs.access(readWriteFile, mode, common.mustNotCall()),
    {
      code: 'ERR_OUT_OF_RANGE',
    }
  );
  assert.throws(
    () => fs.accessSync(readWriteFile, mode),
    {
      code: 'ERR_OUT_OF_RANGE',
    }
  );
});
assert.throws(
  () => { fs.accessSync(doesNotExist); },
  (err) => {
    assert.strictEqual(err.code, 'ENOENT');
    assert.strictEqual(err.path, doesNotExist);
    assert.strictEqual(
      err.message,
      `ENOENT: no such file or directory, access '${doesNotExist}'`
    );
    assert.strictEqual(err.constructor, Error);
    assert.strictEqual(err.syscall, 'access');
    assert.strictEqual(err.errno, UV_ENOENT);
    return true;
  }
);
assert.throws(
  () => { fs.accessSync(Buffer.from(doesNotExist)); },
  (err) => {
    assert.strictEqual(err.code, 'ENOENT');
    assert.strictEqual(err.path, doesNotExist);
    assert.strictEqual(
      err.message,
      `ENOENT: no such file or directory, access '${doesNotExist}'`
    );
    assert.strictEqual(err.constructor, Error);
    assert.strictEqual(err.syscall, 'access');
    assert.strictEqual(err.errno, UV_ENOENT);
    return true;
  }
);
