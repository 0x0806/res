'use strict';
const fs = require('fs');
const {
  open,
  readFile,
  writeFile,
  truncate,
} = fs.promises;
const path = require('path');
const assert = require('assert');
const tmpDir = tmpdir.path;
tmpdir.refresh();
async function validateReadFile() {
  const filePath = path.resolve(tmpDir, 'tmp-read-file.txt');
  const fileHandle = await open(filePath, 'w+');
  const buffer = Buffer.from('Hello world'.repeat(100), 'utf8');
  const fd = fs.openSync(filePath, 'w+');
  fs.writeSync(fd, buffer, 0, buffer.length);
  fs.closeSync(fd);
  const readFileData = await fileHandle.readFile();
  assert.deepStrictEqual(buffer, readFileData);
  await fileHandle.close();
}
async function validateReadFileProc() {
  if (!common.isLinux)
    return;
  const hostname = await fileHandle.readFile();
  assert.ok(hostname.length > 0);
}
async function doReadAndCancel() {
  {
    const filePathForHandle = path.resolve(tmpDir, 'dogs-running.txt');
    const fileHandle = await open(filePathForHandle, 'w+');
    const buffer = Buffer.from('Dogs running'.repeat(10000), 'utf8');
    fs.writeFileSync(filePathForHandle, buffer);
    const signal = AbortSignal.abort();
    await assert.rejects(readFile(fileHandle, { signal }), {
      name: 'AbortError'
    });
    await fileHandle.close();
  }
  {
    const filePathForHandle = path.resolve(tmpDir, 'dogs-running1.txt');
    const fileHandle = await open(filePathForHandle, 'w+');
    const buffer = Buffer.from('Dogs running'.repeat(10000), 'utf8');
    fs.writeFileSync(filePathForHandle, buffer);
    const controller = new AbortController();
    const { signal } = controller;
    process.nextTick(() => controller.abort());
    await assert.rejects(readFile(fileHandle, { signal }), {
      name: 'AbortError'
    }, 'tick-0');
    await fileHandle.close();
  }
  {
    const newFile = path.resolve(tmpDir, 'dogs-running2.txt');
    const buffer = Buffer.from('Dogs running'.repeat(1000), 'utf8');
    fs.writeFileSync(newFile, buffer);
    const fileHandle = await open(newFile, 'r');
    const controller = new AbortController();
    const { signal } = controller;
    tick(1, () => controller.abort());
    await assert.rejects(fileHandle.readFile({ signal, encoding: 'utf8' }), {
      name: 'AbortError'
    }, 'tick-1');
    await fileHandle.close();
  }
  {
    const kIoMaxLength = 2 ** 31 - 1;
    const newFile = path.resolve(tmpDir, 'dogs-running3.txt');
    await writeFile(newFile, Buffer.from('0'));
    await truncate(newFile, kIoMaxLength + 1);
    const fileHandle = await open(newFile, 'r');
    await assert.rejects(fileHandle.readFile(), {
      name: 'RangeError',
      code: 'ERR_FS_FILE_TOO_LARGE'
    });
    await fileHandle.close();
  }
}
validateReadFile()
  .then(validateReadFileProc)
  .then(doReadAndCancel)
  .then(common.mustCall());
