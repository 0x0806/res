'use strict';
common.skipIfInspectorDisabled();
const assert = require('assert');
const { spawnSync } = require('child_process');
const {
  getCpuProfiles,
  kCpuProfInterval,
  verifyFrames
{
  tmpdir.refresh();
  const output = spawnSync(process.execPath, [
    fixtures.path('workload', 'fibonacci-worker-argv.js'),
  ], {
    cwd: tmpdir.path,
    env: {
      ...process.env,
      CPU_PROF_INTERVAL: kCpuProfInterval
    }
  });
  if (output.status !== 0) {
    console.log(output.stderr.toString());
  }
  assert.strictEqual(output.status, 0);
  const profiles = getCpuProfiles(tmpdir.path);
  assert.strictEqual(profiles.length, 1);
  verifyFrames(output, profiles[0], 'fibonacci.js');
}
