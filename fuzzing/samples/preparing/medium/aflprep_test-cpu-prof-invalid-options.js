'use strict';
common.skipIfInspectorDisabled();
const assert = require('assert');
const { spawnSync } = require('child_process');
const {
  kCpuProfInterval,
  env
{
  tmpdir.refresh();
  const output = spawnSync(process.execPath, [
    '--cpu-prof-name',
    'test.cpuprofile',
    fixtures.path('workload', 'fibonacci.js'),
  ], {
    cwd: tmpdir.path,
    env
  });
  const stderr = output.stderr.toString().trim();
  if (output.status !== 9) {
    console.log(stderr);
  }
  assert.strictEqual(output.status, 9);
  assert.strictEqual(
    stderr,
    `${process.execPath}: --cpu-prof-name must be used with --cpu-prof`);
}
{
  tmpdir.refresh();
  const output = spawnSync(process.execPath, [
    '--cpu-prof-dir',
    'prof',
    fixtures.path('workload', 'fibonacci.js'),
  ], {
    cwd: tmpdir.path,
    env
  });
  const stderr = output.stderr.toString().trim();
  if (output.status !== 9) {
    console.log(stderr);
  }
  assert.strictEqual(output.status, 9);
  assert.strictEqual(
    stderr,
    `${process.execPath}: --cpu-prof-dir must be used with --cpu-prof`);
}
{
  tmpdir.refresh();
  const output = spawnSync(process.execPath, [
    '--cpu-prof-interval',
    kCpuProfInterval,
    fixtures.path('workload', 'fibonacci.js'),
  ], {
    cwd: tmpdir.path,
    env
  });
  const stderr = output.stderr.toString().trim();
  if (output.status !== 9) {
    console.log(stderr);
  }
  assert.strictEqual(output.status, 9);
  assert.strictEqual(
    stderr,
    `${process.execPath}: --cpu-prof-interval must be used with --cpu-prof`);
}
