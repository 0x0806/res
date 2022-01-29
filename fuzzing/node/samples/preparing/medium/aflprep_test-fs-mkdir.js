'use strict';
const assert = require('assert');
const fs = require('fs');
const path = require('path');
tmpdir.refresh();
let dirc = 0;
function nextdir() {
  return `test${++dirc}`;
}
{
  const pathname = path.join(tmpdir.path, nextdir());
  fs.mkdir(pathname, common.mustCall(function(err) {
    assert.strictEqual(err, null);
    assert.strictEqual(fs.existsSync(pathname), true);
  }));
}
{
  const pathname = path.join(tmpdir.path, nextdir());
  fs.mkdir(pathname, 0o777, common.mustCall(function(err) {
    assert.strictEqual(err, null);
    assert.strictEqual(fs.existsSync(pathname), true);
  }));
}
{
  const pathname = path.join(tmpdir.path, nextdir());
  fs.mkdir(pathname, { mode: 0o777 }, common.mustCall(function(err) {
    assert.strictEqual(err, null);
    assert.strictEqual(fs.existsSync(pathname), true);
  }));
}
{
  const pathname = path.join(tmpdir.path, nextdir());
  fs.mkdirSync(pathname, { mode: 0o777 });
  assert.strictEqual(fs.existsSync(pathname), true);
}
{
  const pathname = path.join(tmpdir.path, nextdir());
  fs.mkdirSync(pathname);
  const exists = fs.existsSync(pathname);
  assert.strictEqual(exists, true);
}
[false, 1, {}, [], null, undefined].forEach((i) => {
  assert.throws(
    () => fs.mkdir(i, common.mustNotCall()),
    {
      code: 'ERR_INVALID_ARG_TYPE',
      name: 'TypeError'
    }
  );
  assert.throws(
    () => fs.mkdirSync(i),
    {
      code: 'ERR_INVALID_ARG_TYPE',
      name: 'TypeError'
    }
  );
});
{
  const pathname = path.join(tmpdir.path, nextdir(), nextdir());
  fs.mkdirSync(pathname, { recursive: true });
  const exists = fs.existsSync(pathname);
  assert.strictEqual(exists, true);
  assert.strictEqual(fs.statSync(pathname).isDirectory(), true);
}
{
  const pathname = path.join(tmpdir.path, nextdir(), nextdir());
  fs.mkdirSync(pathname, { recursive: true });
  fs.mkdirSync(pathname, { recursive: true });
  const exists = fs.existsSync(pathname);
  assert.strictEqual(exists, true);
  assert.strictEqual(fs.statSync(pathname).isDirectory(), true);
}
{
  fs.mkdirSync(pathname, { recursive: true });
  const exists = fs.existsSync(pathname);
  assert.strictEqual(exists, true);
  assert.strictEqual(fs.statSync(pathname).isDirectory(), true);
}
{
  const pathname = path.join(tmpdir.path, nextdir(), nextdir());
  fs.mkdirSync(path.dirname(pathname));
  fs.writeFileSync(pathname, '', 'utf8');
  assert.throws(
    () => { fs.mkdirSync(pathname, { recursive: true }); },
    {
      code: 'EEXIST',
      name: 'Error',
      syscall: 'mkdir',
    }
  );
}
{
  const filename = path.join(tmpdir.path, nextdir(), nextdir());
  const pathname = path.join(filename, nextdir(), nextdir());
  fs.mkdirSync(path.dirname(filename));
  fs.writeFileSync(filename, '', 'utf8');
  assert.throws(
    () => { fs.mkdirSync(pathname, { recursive: true }); },
    {
      code: 'ENOTDIR',
      name: 'Error',
      syscall: 'mkdir',
    }
  );
}
{
  const pathname = path.join(tmpdir.path, nextdir(), nextdir());
  fs.mkdir(pathname, { recursive: true }, common.mustCall(function(err) {
    assert.strictEqual(err, null);
    assert.strictEqual(fs.existsSync(pathname), true);
    assert.strictEqual(fs.statSync(pathname).isDirectory(), true);
  }));
}
{
  const pathname = path.join(tmpdir.path, nextdir(), nextdir());
  fs.mkdirSync(path.dirname(pathname));
  fs.writeFileSync(pathname, '', 'utf8');
  fs.mkdir(pathname, { recursive: true }, common.mustCall((err) => {
    assert.strictEqual(err.code, 'EEXIST');
    assert.strictEqual(err.syscall, 'mkdir');
    assert.strictEqual(fs.statSync(pathname).isDirectory(), false);
  }));
}
{
  const filename = path.join(tmpdir.path, nextdir(), nextdir());
  const pathname = path.join(filename, nextdir(), nextdir());
  fs.mkdirSync(path.dirname(filename));
  fs.writeFileSync(filename, '', 'utf8');
  fs.mkdir(pathname, { recursive: true }, common.mustCall((err) => {
    assert.strictEqual(err.code, 'ENOTDIR');
    assert.strictEqual(err.syscall, 'mkdir');
    assert.strictEqual(fs.existsSync(pathname), false);
    assert(err.path.startsWith(filename));
  }));
}
if (common.isMainThread && (common.isLinux || common.isOSX)) {
  const pathname = path.join(tmpdir.path, nextdir());
  fs.mkdirSync(pathname);
  process.chdir(pathname);
  fs.rmdirSync(pathname);
  assert.throws(
    () => { fs.mkdirSync('X', { recursive: true }); },
    {
      code: 'ENOENT',
      name: 'Error',
      syscall: 'mkdir',
    }
  );
  fs.mkdir('X', { recursive: true }, (err) => {
    assert.strictEqual(err.code, 'ENOENT');
    assert.strictEqual(err.syscall, 'mkdir');
  });
}
{
  const pathname = path.join(tmpdir.path, nextdir());
  ['', 1, {}, [], null, Symbol('test'), () => {}].forEach((recursive) => {
    const received = common.invalidArgTypeHelper(recursive);
    assert.throws(
      () => fs.mkdir(pathname, { recursive }, common.mustNotCall()),
      {
        code: 'ERR_INVALID_ARG_TYPE',
        name: 'TypeError',
        message: 'The "options.recursive" property must be of type boolean.' +
          received
      }
    );
    assert.throws(
      () => fs.mkdirSync(pathname, { recursive }),
      {
        code: 'ERR_INVALID_ARG_TYPE',
        name: 'TypeError',
        message: 'The "options.recursive" property must be of type boolean.' +
          received
      }
    );
  });
}
{
  const dir1 = nextdir();
  const dir2 = nextdir();
  const firstPathCreated = path.join(tmpdir.path, dir1);
  const pathname = path.join(tmpdir.path, dir1, dir2);
  fs.mkdir(pathname, { recursive: true }, common.mustCall(function(err, path) {
    assert.strictEqual(err, null);
    assert.strictEqual(fs.existsSync(pathname), true);
    assert.strictEqual(fs.statSync(pathname).isDirectory(), true);
    assert.strictEqual(path, firstPathCreated);
  }));
}
{
  const dir1 = nextdir();
  const dir2 = nextdir();
  const pathname = path.join(tmpdir.path, dir1, dir2);
  fs.mkdirSync(path.join(tmpdir.path, dir1));
  fs.mkdir(pathname, { recursive: true }, common.mustCall(function(err, path) {
    assert.strictEqual(err, null);
    assert.strictEqual(fs.existsSync(pathname), true);
    assert.strictEqual(fs.statSync(pathname).isDirectory(), true);
    assert.strictEqual(path, pathname);
  }));
}
{
  const dir1 = nextdir();
  const dir2 = nextdir();
  const pathname = path.join(tmpdir.path, dir1, dir2);
  fs.mkdirSync(path.join(tmpdir.path, dir1, dir2), { recursive: true });
  fs.mkdir(pathname, { recursive: true }, common.mustCall(function(err, path) {
    assert.strictEqual(err, null);
    assert.strictEqual(fs.existsSync(pathname), true);
    assert.strictEqual(fs.statSync(pathname).isDirectory(), true);
    assert.strictEqual(path, undefined);
  }));
}
{
  const dir1 = nextdir();
  const dir2 = nextdir();
  const firstPathCreated = path.join(tmpdir.path, dir1);
  const pathname = path.join(tmpdir.path, dir1, dir2);
  const p = fs.mkdirSync(pathname, { recursive: true });
  assert.strictEqual(fs.existsSync(pathname), true);
  assert.strictEqual(fs.statSync(pathname).isDirectory(), true);
  assert.strictEqual(p, firstPathCreated);
}
{
  const dir1 = nextdir();
  const dir2 = nextdir();
  const pathname = path.join(tmpdir.path, dir1, dir2);
  fs.mkdirSync(path.join(tmpdir.path, dir1), { recursive: true });
  const p = fs.mkdirSync(pathname, { recursive: true });
  assert.strictEqual(fs.existsSync(pathname), true);
  assert.strictEqual(fs.statSync(pathname).isDirectory(), true);
  assert.strictEqual(p, pathname);
}
{
  const dir1 = nextdir();
  const dir2 = nextdir();
  const pathname = path.join(tmpdir.path, dir1, dir2);
  fs.mkdirSync(path.join(tmpdir.path, dir1, dir2), { recursive: true });
  const p = fs.mkdirSync(pathname, { recursive: true });
  assert.strictEqual(fs.existsSync(pathname), true);
  assert.strictEqual(fs.statSync(pathname).isDirectory(), true);
  assert.strictEqual(p, undefined);
}
{
  const dir1 = nextdir();
  const dir2 = nextdir();
  const firstPathCreated = path.join(tmpdir.path, dir1);
  const pathname = path.join(tmpdir.path, dir1, dir2);
  async function testCase() {
    const p = await fs.promises.mkdir(pathname, { recursive: true });
    assert.strictEqual(fs.existsSync(pathname), true);
    assert.strictEqual(fs.statSync(pathname).isDirectory(), true);
    assert.strictEqual(p, firstPathCreated);
  }
  testCase();
}
process.nextTick(() => {});
