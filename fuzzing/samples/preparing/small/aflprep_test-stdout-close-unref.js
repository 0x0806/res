'use strict';
const spawn = require('child_process').spawn;
if (process.argv[2] === 'child') {
  process.stdin.resume();
  process.stdin._handle.close();
  process.stdin.on('error', common.mustCall());
  return;
}
const proc = spawn(process.execPath, [__filename, 'child'], { stdio: 'pipe' });
proc.stderr.pipe(process.stderr);
proc.on('exit', common.mustCall(function(exitCode) {
  if (exitCode !== 0)
    process.exitCode = exitCode;
}));
