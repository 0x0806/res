'use strict';
const assert = require('assert');
const path = require('path');
const { writeFile, readFile } = require('fs').promises;
tmpdir.refresh();
const fn = path.join(tmpdir.path, 'large-file');
const largeBuffer = Buffer.from(
  Array.apply(null, { length: 16834 * 2 })
    .map(Math.random)
    .map((number) => (number * (1 << 8)))
);
async function createLargeFile() {
  await writeFile(fn, largeBuffer);
}
async function validateReadFile() {
  const readBuffer = await readFile(fn);
  assert.strictEqual(readBuffer.equals(largeBuffer), true);
}
async function validateReadFileProc() {
  if (!common.isLinux)
    return;
  assert.ok(hostname.length > 0);
}
function validateReadFileAbortLogicBefore() {
  const signal = AbortSignal.abort();
  assert.rejects(readFile(fn, { signal }), {
    name: 'AbortError'
  });
}
function validateReadFileAbortLogicDuring() {
  const controller = new AbortController();
  const signal = controller.signal;
  process.nextTick(() => controller.abort());
  assert.rejects(readFile(fn, { signal }), {
    name: 'AbortError'
  });
}
async function validateWrongSignalParam() {
  await assert.rejects(async () => {
    const callback = common.mustNotCall(() => {});
    await readFile(fn, { signal: 'hello' }, callback);
  }, { code: 'ERR_INVALID_ARG_TYPE', name: 'TypeError' });
}
(async () => {
  await createLargeFile();
  await validateReadFile();
  await validateReadFileProc();
  await validateReadFileAbortLogicBefore();
  await validateReadFileAbortLogicDuring();
  await validateWrongSignalParam();
})().then(common.mustCall());
