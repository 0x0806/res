'use strict';
if (common.isWindows || common.isAIX)
const assert = require('assert');
const path = require('path');
const fs = require('fs');
if (process.argv[2] === 'child') {
    assert.ifError(er);
    process.stdout.write(data);
  });
  return;
}
const dataExpected = 'a'.repeat(999999);
tmpdir.refresh();
fs.writeFileSync(filename, dataExpected);
const exec = require('child_process').exec;
const f = JSON.stringify(__filename);
const node = JSON.stringify(process.execPath);
const cmd = `cat ${filename} | ${node} ${f} child`;
exec(cmd, { maxBuffer: 1000000 }, common.mustSucceed((stdout, stderr) => {
  assert.strictEqual(
    stdout,
    dataExpected,
    `expect it reads the file and outputs 999999 'a' but got : ${stdout}`
  );
  assert.strictEqual(
    stderr,
    '',
    `expect that it does not write to stderr, but got : ${stderr}`
  );
  console.log('ok');
}));
