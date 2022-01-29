'use strict';
const assert = require('assert');
const path = require('path');
const child_process = require('child_process');
const exeExtension = process.platform === 'win32' ? '.exe' : '';
const exe = 'overlapped-checker' + exeExtension;
const exePath = path.join(path.dirname(process.execPath), exe);
const child = child_process.spawn(exePath, [], {
  stdio: ['overlapped', 'pipe', 'pipe']
});
child.stdin.setEncoding('utf8');
child.stdout.setEncoding('utf8');
child.stderr.setEncoding('utf8');
function writeNext(n) {
  child.stdin.write((n + 50).toString());
}
child.stdout.on('data', (s) => {
  const n = Number(s);
  if (n >= 200) {
    child.stdin.write('exit');
    return;
  }
  writeNext(n);
});
let stderr = '';
child.stderr.on('data', (s) => {
  stderr += s;
});
child.stderr.on('end', common.mustCall(() => {
  assert.strictEqual(stderr, '12333');
}));
child.on('exit', common.mustCall((status) => {
  assert.strictEqual(status, 0);
}));
