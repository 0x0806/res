'use strict';
common.skipIfInspectorDisabled();
const assert = require('assert');
const fs = require('fs');
const path = require('path');
const { spawnSync } = require('child_process');
const {
  getCpuProfiles,
  kCpuProfInterval,
  env,
  getFrames
{
  tmpdir.refresh();
  const output = spawnSync(process.execPath, [
    '--cpu-prof-interval',
    kCpuProfInterval,
    '--cpu-prof-dir',
    'prof',
    '--cpu-prof',
    fixtures.path('workload', 'fibonacci-worker.js'),
  ], {
    cwd: tmpdir.path,
    env
  });
  if (output.status !== 0) {
    console.log(output.stderr.toString());
  }
  assert.strictEqual(output.status, 0);
  const dir = path.join(tmpdir.path, 'prof');
  assert(fs.existsSync(dir));
  const profiles = getCpuProfiles(dir);
  assert.strictEqual(profiles.length, 2);
  const profile1 = getFrames(profiles[0], 'fibonacci.js');
  const profile2 = getFrames(profiles[1], 'fibonacci.js');
  if (profile1.frames.length === 0 && profile2.frames.length === 0) {
    console.log(output.stderr.toString());
    console.log('CPU path: ', profiles[0]);
    console.log(profile1.nodes);
    console.log('CPU path: ', profiles[1]);
    console.log(profile2.nodes);
  }
  assert(profile1.frames.length > 0 || profile2.frames.length > 0);
}
