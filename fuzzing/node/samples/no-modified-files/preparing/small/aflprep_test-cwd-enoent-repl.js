'use strict';
if (common.isSunOS || common.isWindows || common.isAIX)
  common.skip('cannot rmdir current working directory');
if (!common.isMainThread)
  common.skip('process.chdir is not available in Workers');
const assert = require('assert');
const fs = require('fs');
const spawn = require('child_process').spawn;
tmpdir.refresh();
fs.mkdirSync(dirname);
process.chdir(dirname);
fs.rmdirSync(dirname);
const proc = spawn(process.execPath, ['--interactive']);
proc.stdout.pipe(process.stdout);
proc.stderr.pipe(process.stderr);
proc.stdin.write('require("path");\n');
proc.stdin.write('process.exit(42);\n');
proc.once('exit', common.mustCall(function(exitCode, signalCode) {
  assert.strictEqual(exitCode, 42);
  assert.strictEqual(signalCode, null);
}));
