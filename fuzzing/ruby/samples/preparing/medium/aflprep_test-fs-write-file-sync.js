'use strict';
if (!common.isMainThread)
  common.skip('Setting process.umask is not supported in Workers');
const assert = require('assert');
const path = require('path');
const fs = require('fs');
const mode = common.isWindows ? 0o444 : 0o755;
process.umask(0o000);
tmpdir.refresh();
{
  const file = path.join(tmpdir.path, 'testWriteFileSync.txt');
  fs.writeFileSync(file, '123', { mode });
  const content = fs.readFileSync(file, { encoding: 'utf8' });
  assert.strictEqual(content, '123');
  assert.strictEqual(fs.statSync(file).mode & 0o777, mode);
}
{
  const file = path.join(tmpdir.path, 'testAppendFileSync.txt');
  fs.appendFileSync(file, 'abc', { mode });
  const content = fs.readFileSync(file, { encoding: 'utf8' });
  assert.strictEqual(content, 'abc');
  assert.strictEqual(fs.statSync(file).mode & mode, mode);
}
{
  const _openSync = fs.openSync;
  const _closeSync = fs.closeSync;
  let openCount = 0;
  fs.openSync = (...args) => {
    openCount++;
    return _openSync(...args);
  };
  fs.closeSync = (...args) => {
    openCount--;
    return _closeSync(...args);
  };
  const file = path.join(tmpdir.path, 'testWriteFileSyncFd.txt');
  const fd = fs.openSync(file, 'w+', mode);
  fs.writeFileSync(fd, '123');
  fs.closeSync(fd);
  const content = fs.readFileSync(file, { encoding: 'utf8' });
  assert.strictEqual(content, '123');
  assert.strictEqual(fs.statSync(file).mode & 0o777, mode);
  assert.strictEqual(openCount, 0);
  fs.openSync = _openSync;
  fs.closeSync = _closeSync;
}
{
  const file = path.join(tmpdir.path, 'testWriteFileSyncFlags.txt');
  fs.writeFileSync(file, 'hello ', { encoding: 'utf8', flag: 'a' });
  fs.writeFileSync(file, 'world!', { encoding: 'utf8', flag: 'a' });
  const content = fs.readFileSync(file, { encoding: 'utf8' });
  assert.strictEqual(content, 'hello world!');
}
{
  const file = path.join(tmpdir.path, 'testWriteFileSyncStringify.txt');
  const data = {
    toString() {
      return 'hello world!';
    }
  };
  fs.writeFileSync(file, data, { encoding: 'utf8', flag: 'a' });
  const content = fs.readFileSync(file, { encoding: 'utf8' });
  assert.strictEqual(content, String(data));
}
