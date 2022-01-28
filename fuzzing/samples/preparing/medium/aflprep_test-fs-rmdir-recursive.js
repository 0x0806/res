'use strict';
const assert = require('assert');
const fs = require('fs');
const path = require('path');
common.expectWarning(
  'DeprecationWarning',
  'In future versions of Node.js, fs.rmdir(path, { recursive: true }) ' +
      'will be removed. Use fs.rm(path, { recursive: true }) instead',
  'DEP0147'
);
tmpdir.refresh();
let count = 0;
const nextDirPath = (name = 'rmdir-recursive') =>
  path.join(tmpdir.path, `${name}-${count++}`);
function makeNonEmptyDirectory(depth, files, folders, dirname, createSymLinks) {
  fs.mkdirSync(dirname, { recursive: true });
  fs.writeFileSync(path.join(dirname, 'text.txt'), 'hello', 'utf8');
  const options = { flag: 'wx' };
  for (let f = files; f > 0; f--) {
    fs.writeFileSync(path.join(dirname, `f-${depth}-${f}`), '', options);
  }
  if (createSymLinks) {
    fs.symlinkSync(
      `f-${depth}-1`,
      path.join(dirname, `link-${depth}-good`),
      'file'
    );
    fs.symlinkSync(
      'does-not-exist',
      path.join(dirname, `link-${depth}-bad`),
      'file'
    );
  }
  fs.writeFileSync(path.join(dirname, '[a-z0-9].txt'), '', options);
  depth--;
  if (depth <= 0) {
    return;
  }
  for (let f = folders; f > 0; f--) {
    fs.mkdirSync(
      path.join(dirname, `folder-${depth}-${f}`),
      { recursive: true }
    );
    makeNonEmptyDirectory(
      depth,
      files,
      folders,
      path.join(dirname, `d-${depth}-${f}`),
      createSymLinks
    );
  }
}
function removeAsync(dir) {
  fs.rmdir(dir, common.mustCall((err) => {
    assert.strictEqual(err.syscall, 'rmdir');
    fs.rmdir(dir, { recursive: false }, common.mustCall((err) => {
      assert.strictEqual(err.syscall, 'rmdir');
      fs.rmdir(dir, { recursive: true }, common.mustSucceed(() => {
        fs.rmdir(dir, { recursive: true }, common.mustCall((err) => {
          assert.strictEqual(err.code, 'ENOENT');
          fs.rmdir(dir, common.mustCall((err) => {
            assert.strictEqual(err.syscall, 'rmdir');
          }));
        }));
      }));
    }));
  }));
}
{
  let dir = nextDirPath();
  makeNonEmptyDirectory(4, 10, 2, dir, true);
  removeAsync(dir);
  dir = nextDirPath();
  makeNonEmptyDirectory(2, 10, 2, dir, false);
  removeAsync(dir);
  dir = nextDirPath();
  makeNonEmptyDirectory(1, 10, 2, dir, true);
  removeAsync(dir);
}
{
  const dir = nextDirPath();
  makeNonEmptyDirectory(4, 10, 2, dir, true);
  assert.throws(() => {
    fs.rmdirSync(dir);
  }, { syscall: 'rmdir' });
  assert.throws(() => {
    fs.rmdirSync(dir, { recursive: false });
  }, { syscall: 'rmdir' });
  fs.rmdirSync(dir, { recursive: true });
  assert.throws(() => fs.rmdirSync(dir, { recursive: true }),
                { code: 'ENOENT' });
  assert.throws(() => fs.rmdirSync(dir), { syscall: 'rmdir' });
}
(async () => {
  const dir = nextDirPath();
  makeNonEmptyDirectory(4, 10, 2, dir, true);
  assert.rejects(fs.promises.rmdir(dir), { syscall: 'rmdir' });
  assert.rejects(fs.promises.rmdir(dir, { recursive: false }), {
    syscall: 'rmdir'
  });
  await fs.promises.rmdir(dir, { recursive: true });
  await assert.rejects(fs.promises.rmdir(dir, { recursive: true }),
                       { code: 'ENOENT' });
  assert.rejects(fs.promises.rmdir(dir), { syscall: 'rmdir' });
})().then(common.mustCall());
{
  const defaults = {
    retryDelay: 100,
    maxRetries: 0,
    recursive: false
  };
  const modified = {
    retryDelay: 953,
    maxRetries: 5,
    recursive: true
  };
  assert.deepStrictEqual(validateRmdirOptions(), defaults);
  assert.deepStrictEqual(validateRmdirOptions({}), defaults);
  assert.deepStrictEqual(validateRmdirOptions(modified), modified);
  assert.deepStrictEqual(validateRmdirOptions({
    maxRetries: 99
  }), {
    retryDelay: 100,
    maxRetries: 99,
    recursive: false
  });
  [null, 'foo', 5, NaN].forEach((bad) => {
    assert.throws(() => {
      validateRmdirOptions(bad);
    }, {
      code: 'ERR_INVALID_ARG_TYPE',
      name: 'TypeError',
    });
  });
  [undefined, null, 'foo', Infinity, function() {}].forEach((bad) => {
    assert.throws(() => {
      validateRmdirOptions({ recursive: bad });
    }, {
      code: 'ERR_INVALID_ARG_TYPE',
      name: 'TypeError',
    });
  });
  assert.throws(() => {
    validateRmdirOptions({ retryDelay: -1 });
  }, {
    code: 'ERR_OUT_OF_RANGE',
    name: 'RangeError',
  });
  assert.throws(() => {
    validateRmdirOptions({ maxRetries: -1 });
  }, {
    code: 'ERR_OUT_OF_RANGE',
    name: 'RangeError',
  });
}
{
  const original = fs.rmdirSync;
  fs.mkdirSync(dir, { recursive: true });
  let callCount = 0;
  let rmdirSyncOptionsFromRimraf;
  fs.rmdirSync = (path, options) => {
    if (callCount > 0) {
      rmdirSyncOptionsFromRimraf = { ...options };
    }
    callCount++;
    return original(path, options);
  };
  fs.rmdirSync(dir, { recursive: true });
  fs.rmdirSync = original;
  assert.strictEqual(rmdirSyncOptionsFromRimraf.recursive, undefined);
}
