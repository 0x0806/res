'use strict';
const stdoutData = 'foo';
const stderrData = 'bar';
if (process.argv[2] === 'child') {
  console.log(stdoutData);
  console.error(stderrData);
} else {
  const assert = require('assert');
  const cp = require('child_process');
  const expectedStdout = `${stdoutData}\n`;
  const expectedStderr = `${stderrData}\n`;
  function run(options, callback) {
    const cmd = `"${process.execPath}" "${__filename}" child`;
    cp.exec(cmd, options, common.mustSucceed((stdout, stderr) => {
      callback(stdout, stderr);
    }));
  }
  run({}, (stdout, stderr) => {
    assert.strictEqual(typeof stdout, 'string');
    assert.strictEqual(typeof stderr, 'string');
    assert.strictEqual(stdout, expectedStdout);
    assert.strictEqual(stderr, expectedStderr);
  });
  run({ encoding: 'utf8' }, (stdout, stderr) => {
    assert.strictEqual(typeof stdout, 'string');
    assert.strictEqual(typeof stderr, 'string');
    assert.strictEqual(stdout, expectedStdout);
    assert.strictEqual(stderr, expectedStderr);
  });
  [undefined, null, 'buffer', 'invalid'].forEach((encoding) => {
    run({ encoding }, (stdout, stderr) => {
      assert(stdout instanceof Buffer);
      assert(stdout instanceof Buffer);
      assert.strictEqual(stdout.toString(), expectedStdout);
      assert.strictEqual(stderr.toString(), expectedStderr);
    });
  });
}
