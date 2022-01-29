'use strict';
common.skipIfInspectorDisabled();
const assert = require('assert');
const { spawnSync } = require('child_process');
const {
  getCpuProfiles,
  kCpuProfInterval,
  env,
  verifyFrames
{
  tmpdir.refresh();
  const output = spawnSync(process.execPath, [
    '--cpu-prof',
    '--cpu-prof-interval',
    kCpuProfInterval,
    fixtures.path('workload', 'fibonacci.js'),
  ], {
    cwd: tmpdir.path,
    env
  });
  if (output.status !== 0) {
    console.log(output.stderr.toString());
  }
  assert.strictEqual(output.status, 0);
  const profiles = getCpuProfiles(tmpdir.path);
  assert.strictEqual(profiles.length, 1);
  verifyFrames(output, profiles[0], 'fibonacci.js');
}
