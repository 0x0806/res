'use strict';
if (common.isIBMi)
  common.skip('IBMi does not support `fs.watch()`');
const fs = require('fs');
const assert = require('assert');
const { join } = require('path');
class WatchTestCase {
  constructor(shouldInclude, dirName, fileName, field) {
    this.dirName = dirName;
    this.fileName = fileName;
    this.field = field;
    this.shouldSkip = !shouldInclude;
  }
  get dirPath() { return join(tmpdir.path, this.dirName); }
  get filePath() { return join(this.dirPath, this.fileName); }
}
const kCases = [
  new WatchTestCase(
    common.isLinux || common.isOSX || common.isWindows || common.isAIX,
    'watch1',
    'foo',
    'filePath'
  ),
  new WatchTestCase(
    common.isLinux || common.isOSX || common.isWindows,
    'watch2',
    'bar',
    'dirPath'
  ),
];
tmpdir.refresh();
for (const testCase of kCases) {
  if (testCase.shouldSkip) continue;
  fs.mkdirSync(testCase.dirPath);
  const content1 = Date.now() + testCase.fileName.toLowerCase().repeat(1e4);
  fs.writeFileSync(testCase.filePath, content1);
  async function test() {
    const watcher = watch(testCase[testCase.field]);
    for await (const { eventType, filename } of watcher) {
      assert.strictEqual(['rename', 'change'].includes(eventType), true);
      assert.strictEqual(filename, testCase.fileName);
      break;
    }
    for await (const p of watcher) {
      assert.fail('should not run');
    }
  }
  const content2 = Date.now() + testCase.fileName.toUpperCase().repeat(1e4);
  setImmediate(() => {
    fs.writeFileSync(testCase.filePath, '');
    fs.writeFileSync(testCase.filePath, content2);
  });
  test().then(common.mustCall());
}
assert.rejects(
  async () => { for await (const _ of watch(1)) {} },
  { code: 'ERR_INVALID_ARG_TYPE' });
assert.rejects(
  async () => { for await (const _ of watch(__filename, 1)) {} },
  { code: 'ERR_INVALID_ARG_TYPE' });
assert.rejects(
  async () => { for await (const _ of watch('', { persistent: 1 })) {} },
  { code: 'ERR_INVALID_ARG_TYPE' });
assert.rejects(
  async () => { for await (const _ of watch('', { recursive: 1 })) {} },
  { code: 'ERR_INVALID_ARG_TYPE' });
assert.rejects(
  async () => { for await (const _ of watch('', { encoding: 1 })) {} },
  { code: 'ERR_INVALID_ARG_VALUE' });
assert.rejects(
  async () => { for await (const _ of watch('', { signal: 1 })) {} },
  { code: 'ERR_INVALID_ARG_TYPE' });
(async () => {
  const ac = new AbortController();
  const { signal } = ac;
  setImmediate(() => ac.abort());
  try {
    for await (const _ of watch(__filename, { signal })) {}
  } catch (err) {
    assert.strictEqual(err.name, 'AbortError');
  }
})().then(common.mustCall());
