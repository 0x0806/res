'use strict';
const assert = require('assert');
const fork = require('child_process').fork;
const path = require('path');
const runjs = path.join(__dirname, '..', '..', 'benchmark', 'run.js');
function runBenchmark(name, env) {
  const argv = ['test'];
  argv.push(name);
  const mergedEnv = { ...process.env, ...env };
  const child = fork(runjs, argv, {
    env: mergedEnv,
    stdio: ['inherit', 'pipe', 'inherit', 'ipc']
  });
  child.stdout.setEncoding('utf8');
  let stdout = '';
  child.stdout.on('data', (line) => {
    stdout += line;
  });
  child.on('exit', (code, signal) => {
    assert.strictEqual(code, 0);
    assert.strictEqual(signal, null);
    assert.ok(
      `benchmark file not running exactly one configuration in test: ${stdout}`
    );
  });
}
module.exports = runBenchmark;
