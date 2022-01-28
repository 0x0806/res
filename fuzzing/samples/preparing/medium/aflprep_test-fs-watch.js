'use strict';
if (common.isIBMi)
  common.skip('IBMi does not support fs.watch()');
const assert = require('assert');
const fs = require('fs');
const path = require('path');
if (!common.isMainThread)
  common.skip('process.chdir is not available in Workers');
const expectFilePath = common.isWindows ||
                       common.isLinux ||
                       common.isOSX ||
                       common.isAIX;
const testDir = tmpdir.path;
tmpdir.refresh();
function repeat(fn) {
  setImmediate(fn);
  const interval = setInterval(fn, 5000);
  return interval;
}
{
  const filepath = path.join(testDir, 'watch.txt');
  fs.writeFileSync(filepath, 'hello');
  const watcher = fs.watch(filepath);
  watcher.on('change', common.mustCall(function(event, filename) {
    assert.strictEqual(event, 'change');
    if (expectFilePath) {
      assert.strictEqual(filename, 'watch.txt');
    }
    clearInterval(interval);
    watcher.close();
  }));
  const interval = repeat(() => { fs.writeFileSync(filepath, 'world'); });
}
{
  const filepathAbs = path.join(testDir, 'hasOwnProperty');
  process.chdir(testDir);
  fs.writeFileSync(filepathAbs, 'howdy');
  const watcher =
    fs.watch('hasOwnProperty', common.mustCall(function(event, filename) {
      assert.strictEqual(event, 'change');
      if (expectFilePath) {
        assert.strictEqual(filename, 'hasOwnProperty');
      }
      clearInterval(interval);
      watcher.close();
    }));
  const interval = repeat(() => { fs.writeFileSync(filepathAbs, 'pardner'); });
}
{
  const testsubdir = fs.mkdtempSync(testDir + path.sep);
  const filepath = path.join(testsubdir, 'newfile.txt');
  const watcher =
    fs.watch(testsubdir, common.mustCall(function(event, filename) {
      const renameEv = common.isSunOS || common.isAIX ? 'change' : 'rename';
      assert.strictEqual(event, renameEv);
      if (expectFilePath) {
        assert.strictEqual(filename, 'newfile.txt');
      } else {
        assert.strictEqual(filename, null);
      }
      clearInterval(interval);
      watcher.close();
    }));
  const interval = repeat(() => {
    fs.rmSync(filepath, { force: true });
    const fd = fs.openSync(filepath, 'w');
    fs.closeSync(fd);
  });
}
{
  fs.watch(__filename, { persistent: false }, common.mustNotCall());
}
{
  let oldhandle;
  assert.throws(
    () => {
      const w = fs.watch(__filename, common.mustNotCall());
      oldhandle = w._handle;
      w._handle = { close: w._handle.close };
      w.close();
    },
    {
      name: 'Error',
      code: 'ERR_INTERNAL_ASSERTION',
    }
  );
}
{
  let oldhandle;
  assert.throws(
    () => {
      const w = fs.watch(__filename, common.mustNotCall());
      oldhandle = w._handle;
      const protoSymbols =
        Object.getOwnPropertySymbols(Object.getPrototypeOf(w));
      const kFSWatchStart =
        protoSymbols.find((val) => val.toString() === 'Symbol(kFSWatchStart)');
      w._handle = {};
      w[kFSWatchStart]();
    },
    {
      name: 'Error',
      code: 'ERR_INTERNAL_ASSERTION',
    }
  );
}
