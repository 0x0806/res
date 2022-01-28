'use strict';
const assert = require('assert');
const cluster = require('cluster');
const fork = require('child_process').fork;
const MAGIC_EXIT_CODE = 42;
const isTestRunner = process.argv[2] !== 'child';
if (isTestRunner) {
  const primary = fork(__filename, ['child']);
  primary.on('exit', common.mustCall((code) => {
    assert.strictEqual(code, MAGIC_EXIT_CODE);
  }));
} else if (cluster.isPrimary) {
  process.on('uncaughtException', common.mustCall(() => {
    process.nextTick(() => process.exit(MAGIC_EXIT_CODE));
  }));
  cluster.fork();
  throw new Error('kill primary');
  process.exit();
}
