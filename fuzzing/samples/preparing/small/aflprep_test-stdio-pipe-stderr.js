'use strict';
const assert = require('assert');
const fs = require('fs');
const join = require('path').join;
const spawn = require('child_process').spawnSync;
tmpdir.refresh();
const fakeModulePath = join(tmpdir.path, 'batman.js');
const stderrOutputPath = join(tmpdir.path, 'stderr-output.txt');
const stream = fs.createWriteStream(stderrOutputPath);
fs.writeFileSync(fakeModulePath, '', 'utf8');
stream.on('open', () => {
  spawn(process.execPath, {
    stdio: ['pipe', 'pipe', stream]
  });
  const stderr = fs.readFileSync(stderrOutputPath, 'utf8').trim();
  assert.strictEqual(
    stderr,
    '',
    `piping stderr to file should not result in exception: ${stderr}`
  );
  stream.end();
  fs.unlinkSync(stderrOutputPath);
  fs.unlinkSync(fakeModulePath);
});
