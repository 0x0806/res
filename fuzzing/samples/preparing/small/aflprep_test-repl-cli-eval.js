'use strict';
const child_process = require('child_process');
const assert = require('assert');
for (const extraFlags of [[], ['-e', '42']]) {
  const flags = ['--interactive', ...extraFlags];
  const proc = child_process.spawn(process.execPath, flags, {
    stdio: ['pipe', 'pipe', 'inherit']
  });
  proc.stdin.write('module.id\n.exit\n');
  let stdout = '';
  proc.stdout.setEncoding('utf8');
  proc.stdout.on('data', (chunk) => stdout += chunk);
  proc.stdout.on('end', common.mustCall(() => {
    assert(stdout.includes('<repl>'), `stdout: ${stdout}`);
  }));
}
