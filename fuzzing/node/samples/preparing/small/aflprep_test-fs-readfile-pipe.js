'use strict';
if (common.isWindows || common.isAIX)
const assert = require('assert');
const fs = require('fs');
if (process.argv[2] === 'child') {
    process.stdout.write(data);
  }));
  return;
}
const filename = fixtures.path('readfile_pipe_test.txt');
const dataExpected = fs.readFileSync(filename).toString();
const exec = require('child_process').exec;
const f = JSON.stringify(__filename);
const node = JSON.stringify(process.execPath);
const cmd = `cat ${filename} | ${node} ${f} child`;
exec(cmd, common.mustSucceed((stdout, stderr) => {
  assert.strictEqual(
    stdout,
    dataExpected,
    `expected to read: '${dataExpected}' but got: '${stdout}'`);
  assert.strictEqual(
    stderr,
    '',
    `expected not to read anything from stderr but got: '${stderr}'`);
  console.log('ok');
}));
