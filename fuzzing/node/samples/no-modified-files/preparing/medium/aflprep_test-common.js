'use strict';
const assert = require('assert');
const { execFile } = require('child_process');
const { writeFileSync, existsSync } = require('fs');
const { join } = require('path');
{
  const p = fixtures.path('leakedGlobal.js');
  execFile(process.execPath, [p], common.mustCall((err, stdout, stderr) => {
    assert.notStrictEqual(err.code, 0);
  }));
}
{
  const p = fixtures.path('leakedGlobal.js');
  execFile(process.execPath, [p], {
    env: { ...process.env, NODE_TEST_KNOWN_GLOBALS: 0 }
  }, common.mustCall((err, stdout, stderr) => {
    assert.strictEqual(err, null);
    assert.strictEqual(stderr.trim(), '');
  }));
}
assert.throws(function() {
  common.mustCall(function() {}, 'foo');
assert.throws(function() {
assert.throws(function() {
assert.throws(
  () => { assert.fail('fhqwhgads'); },
  {
    code: 'ERR_ASSERTION',
  });
const fnOnce = common.mustCall(() => {});
fnOnce();
const fnTwice = common.mustCall(() => {}, 2);
fnTwice();
fnTwice();
const fnAtLeast1Called1 = common.mustCallAtLeast(() => {}, 1);
fnAtLeast1Called1();
const fnAtLeast1Called2 = common.mustCallAtLeast(() => {}, 1);
fnAtLeast1Called2();
fnAtLeast1Called2();
const fnAtLeast2Called2 = common.mustCallAtLeast(() => {}, 2);
fnAtLeast2Called2();
fnAtLeast2Called2();
const fnAtLeast2Called3 = common.mustCallAtLeast(() => {}, 2);
fnAtLeast2Called3();
fnAtLeast2Called3();
fnAtLeast2Called3();
const failFixtures = [
  [
    fixtures.path('failmustcall1.js'),
    'Mismatched <anonymous> function calls. Expected exactly 2, actual 1.',
  ], [
    fixtures.path('failmustcall2.js'),
    'Mismatched <anonymous> function calls. Expected at least 2, actual 1.',
  ],
];
for (const p of failFixtures) {
  const [file, expected] = p;
  execFile(process.execPath, [file], common.mustCall((err, stdout, stderr) => {
    assert.ok(err);
    assert.strictEqual(stderr, '');
    const firstLine = stdout.split('\n').shift();
    assert.strictEqual(firstLine, expected);
  }));
}
const HIJACK_TEST_ARRAY = [ 'foo\n', 'bar\n', 'baz\n' ];
[ 'err', 'out' ].forEach((txt) => {
  const stream = process[`std${txt}`];
  const originalWrite = stream.write;
  hijackstdio[`hijackStd${txt}`](common.mustCall(function(data) {
    assert.strictEqual(data, HIJACK_TEST_ARRAY[stream.writeTimes]);
  }, HIJACK_TEST_ARRAY.length));
  assert.notStrictEqual(originalWrite, stream.write);
  HIJACK_TEST_ARRAY.forEach((val) => {
    stream.write(val, common.mustCall());
  });
  assert.strictEqual(HIJACK_TEST_ARRAY.length, stream.writeTimes);
  hijackstdio[`restoreStd${txt}`]();
  assert.strictEqual(originalWrite, stream.write);
});
{
  tmpdir.refresh();
  const sentinelPath = join(tmpdir.path, 'gaga');
  writeFileSync(sentinelPath, 'googoo');
  tmpdir.refresh();
  assert.strictEqual(existsSync(tmpdir.path), true);
  assert.strictEqual(existsSync(sentinelPath), false);
}
{
  [['err', 'error'], ['out', 'log']].forEach(([type, method]) => {
    hijackstdio[`hijackStd${type}`](common.mustCall(function(data) {
      assert.strictEqual(data, 'test\n');
      throw new Error(`console ${type} error`);
    }));
    console[method]('test');
    hijackstdio[`restoreStd${type}`]();
  });
  let uncaughtTimes = 0;
  process.on('uncaughtException', common.mustCallAtLeast(function(e) {
    assert.strictEqual(uncaughtTimes < 2, true);
    assert.strictEqual(e instanceof Error, true);
    assert.strictEqual(
      e.message,
      `console ${(['err', 'out'])[uncaughtTimes++]} error`);
  }, 2));
