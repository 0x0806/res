'use strict';
const assert = require('assert');
const fs = require('fs');
const path = require('path');
tmpdir.refresh();
let count = 0;
const nextDirPath = (name = 'rm') =>
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
  fs.rm(dir, common.mustCall((err) => {
    assert.strictEqual(err.syscall, 'rm');
    fs.rm(dir, { recursive: false }, common.mustCall((err) => {
      assert.strictEqual(err.syscall, 'rm');
      fs.rm(dir, { recursive: true }, common.mustSucceed(() => {
        fs.rm(dir, common.mustCall((err) => {
          assert.strictEqual(err.syscall, 'stat');
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
  fs.rm(
    path.join(tmpdir.path, 'noexist.txt'),
    { recursive: true },
    common.mustCall((err) => {
      assert.strictEqual(err.code, 'ENOENT');
    })
  );
  const filePath = path.join(tmpdir.path, 'rm-async-file.txt');
  fs.writeFileSync(filePath, '');
  fs.rm(filePath, { recursive: true }, common.mustCall((err) => {
    try {
      assert.strictEqual(err, null);
      assert.strictEqual(fs.existsSync(filePath), false);
    } finally {
      fs.rmSync(filePath, { force: true });
    }
  }));
}
{
  const dir = nextDirPath();
  makeNonEmptyDirectory(4, 10, 2, dir, true);
  assert.throws(() => {
    fs.rmSync(dir);
  }, { syscall: 'rm' });
  assert.throws(() => {
    fs.rmSync(dir, { recursive: false });
  }, { syscall: 'rm' });
  assert.throws(() => {
    fs.rmSync(path.join(tmpdir.path, 'noexist.txt'), { recursive: true });
  }, {
    code: 'ENOENT',
    name: 'Error',
  });
  const filePath = path.join(tmpdir.path, 'rm-file.txt');
  fs.writeFileSync(filePath, '');
  try {
    fs.rmSync(filePath, { recursive: true });
  } finally {
    fs.rmSync(filePath, { force: true });
  }
  fs.rmSync(dir, { recursive: true });
  assert.throws(() => fs.rmSync(dir), { syscall: 'stat' });
}
(async () => {
  const dir = nextDirPath();
  makeNonEmptyDirectory(4, 10, 2, dir, true);
  assert.rejects(fs.promises.rm(dir), { syscall: 'rm' });
  assert.rejects(fs.promises.rm(dir, { recursive: false }), {
    syscall: 'rm'
  });
  await fs.promises.rm(dir, { recursive: true });
  assert.rejects(fs.promises.rm(dir), { syscall: 'stat' });
  assert.rejects(fs.promises.rm(
    path.join(tmpdir.path, 'noexist.txt'),
    { recursive: true }
  ), {
    code: 'ENOENT',
    name: 'Error',
  });
  fs.promises.rm(path.join(tmpdir.path, 'noexist.txt'), { force: true });
  const filePath = path.join(tmpdir.path, 'rm-promises-file.txt');
  fs.writeFileSync(filePath, '');
  try {
    await fs.promises.rm(filePath, { recursive: true });
  } finally {
    fs.rmSync(filePath, { force: true });
  }
})().then(common.mustCall());
{
  const dir = nextDirPath();
  makeNonEmptyDirectory(4, 10, 2, dir, true);
  const filePath = (path.join(tmpdir.path, 'rm-args-file.txt'));
  fs.writeFileSync(filePath, '');
  const defaults = {
    retryDelay: 100,
    maxRetries: 0,
    recursive: false,
    force: false
  };
  const modified = {
    retryDelay: 953,
    maxRetries: 5,
    recursive: true,
    force: false
  };
  assert.deepStrictEqual(validateRmOptionsSync(filePath), defaults);
  assert.deepStrictEqual(validateRmOptionsSync(filePath, {}), defaults);
  assert.deepStrictEqual(validateRmOptionsSync(filePath, modified), modified);
  assert.deepStrictEqual(validateRmOptionsSync(filePath, {
    maxRetries: 99
  }), {
    retryDelay: 100,
    maxRetries: 99,
    recursive: false,
    force: false
  });
  [null, 'foo', 5, NaN].forEach((bad) => {
    assert.throws(() => {
      validateRmOptionsSync(filePath, bad);
    }, {
      code: 'ERR_INVALID_ARG_TYPE',
      name: 'TypeError',
    });
  });
  [undefined, null, 'foo', Infinity, function() {}].forEach((bad) => {
    assert.throws(() => {
      validateRmOptionsSync(filePath, { recursive: bad });
    }, {
      code: 'ERR_INVALID_ARG_TYPE',
      name: 'TypeError',
    });
  });
  [undefined, null, 'foo', Infinity, function() {}].forEach((bad) => {
    assert.throws(() => {
      validateRmOptionsSync(filePath, { force: bad });
    }, {
      code: 'ERR_INVALID_ARG_TYPE',
      name: 'TypeError',
    });
  });
  assert.throws(() => {
    validateRmOptionsSync(filePath, { retryDelay: -1 });
  }, {
    code: 'ERR_OUT_OF_RANGE',
    name: 'RangeError',
  });
  assert.throws(() => {
    validateRmOptionsSync(filePath, { maxRetries: -1 });
  }, {
    code: 'ERR_OUT_OF_RANGE',
    name: 'RangeError',
  });
}
