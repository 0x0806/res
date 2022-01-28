'use strict';
const assert = require('assert');
const cp = require('child_process');
const fs = require('fs');
if (!common.isWindows)
  common.skip('Windows specific test.');
tmpdir.refresh();
const tmpPath = `${tmpdir.path}\\path with spaces`;
fs.mkdirSync(tmpPath);
const test = (shell) => {
  cp.exec('echo foo bar', { shell: shell },
          common.mustSucceed((stdout, stderror) => {
            assert.ok(!stderror);
            assert.ok(stdout.includes('foo') && stdout.includes('bar'));
          }));
};
const testCopy = (shellName, shellPath) => {
  const copyPath = `${tmpPath}\\${shellName}`;
  fs.symlinkSync(shellPath, copyPath);
  test(copyPath);
};
const system32 = `${process.env.SystemRoot}\\System32`;
test(true);
test('cmd');
testCopy('cmd.exe', `${system32}\\cmd.exe`);
test('cmd.exe');
test('CMD');
test('powershell');
testCopy('powershell.exe',
         `${system32}\\WindowsPowerShell\\v1.0\\powershell.exe`);
fs.writeFile(`${tmpPath}\\test file`, 'Test', common.mustSucceed(() => {
  cp.exec(`Get-ChildItem "${tmpPath}" | Select-Object -Property Name`,
          { shell: 'PowerShell' },
          common.mustSucceed((stdout, stderror) => {
            assert.ok(!stderror);
            assert.ok(stdout.includes(
              'test file'));
          }));
}));
cp.exec('where bash', common.mustCall((error, stdout) => {
  if (error) {
    return;
  }
  for (let i = 0; i < lines.length; ++i) {
    const bashPath = lines[i].trim();
    test(bashPath);
    testCopy(`bash_${i}.exe`, bashPath);
  }
}));
