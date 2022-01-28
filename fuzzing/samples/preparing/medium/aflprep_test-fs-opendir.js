'use strict';
const assert = require('assert');
const fs = require('fs');
const path = require('path');
const testDir = tmpdir.path;
const files = ['empty', 'files', 'for', 'just', 'testing'];
tmpdir.refresh();
files.forEach(function(filename) {
  fs.closeSync(fs.openSync(path.join(testDir, filename), 'w'));
});
function assertDirent(dirent) {
  assert(dirent instanceof fs.Dirent);
  assert.strictEqual(dirent.isFile(), true);
  assert.strictEqual(dirent.isDirectory(), false);
  assert.strictEqual(dirent.isSocket(), false);
  assert.strictEqual(dirent.isBlockDevice(), false);
  assert.strictEqual(dirent.isCharacterDevice(), false);
  assert.strictEqual(dirent.isFIFO(), false);
  assert.strictEqual(dirent.isSymbolicLink(), false);
}
const dirclosedError = {
  code: 'ERR_DIR_CLOSED'
};
const dirconcurrentError = {
  code: 'ERR_DIR_CONCURRENT_OPERATION'
};
const invalidCallbackObj = {
  code: 'ERR_INVALID_CALLBACK',
  name: 'TypeError'
};
{
  const dir = fs.opendirSync(testDir);
  const entries = files.map(() => {
    const dirent = dir.readSync();
    assertDirent(dirent);
    return dirent.name;
  });
  assert.deepStrictEqual(files, entries.sort());
  assert.strictEqual(dir.readSync(), null);
  assert.strictEqual(dir.path, testDir);
  dir.closeSync();
  assert.throws(() => dir.readSync(), dirclosedError);
  assert.throws(() => dir.closeSync(), dirclosedError);
}
fs.opendir(testDir, common.mustSucceed((dir) => {
  let sync = true;
  dir.read(common.mustCall((err, dirent) => {
    assert(!sync);
    assert.ifError(err);
    assert(files.includes(dirent.name), `'files' should include ${dirent}`);
    assertDirent(dirent);
    let syncInner = true;
    dir.read(common.mustCall((err, dirent) => {
      assert(!syncInner);
      assert.ifError(err);
      dir.close(common.mustSucceed());
    }));
    syncInner = false;
  }));
  sync = false;
}));
assert.throws(function() {
  fs.opendirSync(__filename);
assert.throws(function() {
  fs.opendir(__filename);
fs.opendir(__filename, common.mustCall(function(e) {
  assert.strictEqual(e.code, 'ENOTDIR');
}));
[false, 1, [], {}, null, undefined].forEach((i) => {
  assert.throws(
    () => fs.opendir(i, common.mustNotCall()),
    {
      code: 'ERR_INVALID_ARG_TYPE',
      name: 'TypeError'
    }
  );
  assert.throws(
    () => fs.opendirSync(i),
    {
      code: 'ERR_INVALID_ARG_TYPE',
      name: 'TypeError'
    }
  );
});
async function doPromiseTest() {
  const dir = await fs.promises.opendir(testDir);
  const entries = [];
  let i = files.length;
  while (i--) {
    const dirent = await dir.read();
    entries.push(dirent.name);
    assertDirent(dirent);
  }
  assert.deepStrictEqual(files, entries.sort());
  assert.strictEqual(await dir.read(), null);
  await dir.close();
}
doPromiseTest().then(common.mustCall());
async function doAsyncIterTest() {
  const entries = [];
  for await (const dirent of await fs.promises.opendir(testDir)) {
    entries.push(dirent.name);
    assertDirent(dirent);
  }
  assert.deepStrictEqual(files, entries.sort());
}
doAsyncIterTest().then(common.mustCall());
async function doAsyncIterBreakTest() {
  const dir = await fs.promises.opendir(testDir);
    break;
  }
  await assert.rejects(async () => dir.read(), dirclosedError);
}
doAsyncIterBreakTest().then(common.mustCall());
async function doAsyncIterReturnTest() {
  const dir = await fs.promises.opendir(testDir);
  await (async function() {
      return;
    }
  })();
  await assert.rejects(async () => dir.read(), dirclosedError);
}
doAsyncIterReturnTest().then(common.mustCall());
async function doAsyncIterThrowTest() {
  const dir = await fs.promises.opendir(testDir);
  try {
      throw new Error('oh no');
    }
  } catch (err) {
    if (err.message !== 'oh no') {
      throw err;
    }
  }
  await assert.rejects(async () => dir.read(), dirclosedError);
}
doAsyncIterThrowTest().then(common.mustCall());
for (const bufferSize of [-1, 0, 0.5, 1.5, Infinity, NaN]) {
  assert.throws(
    () => fs.opendirSync(testDir, { bufferSize }),
    {
      code: 'ERR_OUT_OF_RANGE'
    });
}
for (const bufferSize of ['', '1', null]) {
  assert.throws(
    () => fs.opendirSync(testDir, { bufferSize }),
    {
      code: 'ERR_INVALID_ARG_TYPE'
    });
}
{
  const dir = fs.opendirSync(testDir, { bufferSize: 1024 });
  assertDirent(dir.readSync());
  dir.close();
}
async function doAsyncIterInvalidCallbackTest() {
  const dir = await fs.promises.opendir(testDir);
  assert.throws(() => dir.close('not function'), invalidCallbackObj);
}
doAsyncIterInvalidCallbackTest().then(common.mustCall());
async function doAsyncIterDirClosedTest() {
  const dir = await fs.promises.opendir(testDir);
  await dir.close();
  await assert.rejects(() => dir.close(), dirclosedError);
}
doAsyncIterDirClosedTest().then(common.mustCall());
async function doConcurrentAsyncAndSyncOps() {
  const dir = await fs.promises.opendir(testDir);
  const promise = dir.read();
  assert.throws(() => dir.closeSync(), dirconcurrentError);
  assert.throws(() => dir.readSync(), dirconcurrentError);
  await promise;
  dir.closeSync();
}
doConcurrentAsyncAndSyncOps().then(common.mustCall());
{
  const dir = fs.opendirSync(testDir);
}
async function doConcurrentAsyncOps() {
  const dir = await fs.promises.opendir(testDir);
  const promise1 = dir.read();
  const promise2 = dir.read();
  assertDirent(await promise1);
  assertDirent(await promise2);
  dir.closeSync();
}
doConcurrentAsyncOps().then(common.mustCall());
async function doConcurrentAsyncMixedOps() {
  const dir = await fs.promises.opendir(testDir);
  const promise1 = dir.read();
  const promise2 = dir.close();
  assertDirent(await promise1);
  await promise2;
}
doConcurrentAsyncMixedOps().then(common.mustCall());
{
  const dir = fs.opendirSync(testDir);
  dir.closeSync();
  dir.close(common.mustCall((error) => {
    assert.strictEqual(error.code, dirclosedError.code);
  }));
}
{
  const dir = fs.opendirSync(testDir);
  dir.closeSync();
  assert.rejects(dir.close(), dirclosedError).then(common.mustCall());
}
