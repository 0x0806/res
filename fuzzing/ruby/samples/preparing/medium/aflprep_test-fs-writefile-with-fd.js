'use strict';
const assert = require('assert');
const fs = require('fs');
const join = require('path').join;
tmpdir.refresh();
{
  const filename = join(tmpdir.path, 'test.txt');
  const fd = fs.openSync(filename, 'w');
  try {
    assert.deepStrictEqual(fs.writeSync(fd, 'Hello'), 5);
    assert.deepStrictEqual(fs.readFileSync(filename).toString(), 'Hello');
    fs.writeFileSync(fd, 'World');
    assert.deepStrictEqual(fs.readFileSync(filename).toString(), 'HelloWorld');
  } finally {
    fs.closeSync(fd);
  }
}
const fdsToCloseOnExit = [];
process.on('beforeExit', common.mustCall(() => {
  for (const fd of fdsToCloseOnExit) {
    try {
      fs.closeSync(fd);
    } catch {
    }
  }
}));
{
  const file = join(tmpdir.path, 'test1.txt');
  fs.open(file, 'w', common.mustSucceed((fd) => {
    fdsToCloseOnExit.push(fd);
    fs.write(fd, 'Hello', common.mustSucceed((bytes) => {
      assert.strictEqual(bytes, 5);
      assert.deepStrictEqual(fs.readFileSync(file).toString(), 'Hello');
      fs.writeFile(fd, 'World', common.mustSucceed(() => {
        assert.deepStrictEqual(fs.readFileSync(file).toString(), 'HelloWorld');
      }));
    }));
  }));
}
{
  const file = join(tmpdir.path, 'test.txt');
  fs.open(file, 'r', common.mustSucceed((fd) => {
    fdsToCloseOnExit.push(fd);
    fs.writeFile(fd, 'World', common.expectsError(expectedError));
  }));
}
{
  const controller = new AbortController();
  const signal = controller.signal;
  const file = join(tmpdir.path, 'test.txt');
  fs.open(file, 'w', common.mustSucceed((fd) => {
    fdsToCloseOnExit.push(fd);
    fs.writeFile(fd, 'World', { signal }, common.expectsError({
      name: 'AbortError'
    }));
  }));
  controller.abort();
}
