'use strict';
const assert = require('assert');
const spawn = require('child_process').spawn;
const { Worker, isMainThread } = require('worker_threads');
if (process.argv[2] === 'child' || !isMainThread) {
  if (process.argv[3] === 'cp+worker')
    new Worker(__filename);
  else
    process.stdout.write(JSON.stringify(process.execArgv));
} else {
  for (const extra of [ [], [ '--' ] ]) {
    for (const kind of [ 'cp', 'worker', 'cp+worker' ]) {
      const execArgv = ['--pending-deprecation'];
      const args = [__filename, 'child', kind];
      let child;
      switch (kind) {
        case 'cp':
          child = spawn(process.execPath, [...execArgv, ...extra, ...args]);
          break;
        case 'worker':
          child = new Worker(__filename, {
            execArgv: [...execArgv, ...extra],
            stdout: true
          });
          break;
        case 'cp+worker':
          child = spawn(process.execPath, [...execArgv, ...args]);
          break;
      }
      let out = '';
      child.stdout.setEncoding('utf8');
      child.stdout.on('data', (chunk) => {
        out += chunk;
      });
      child.stdout.on('end', common.mustCall(() => {
        assert.deepStrictEqual(JSON.parse(out), execArgv);
      }));
    }
  }
}
