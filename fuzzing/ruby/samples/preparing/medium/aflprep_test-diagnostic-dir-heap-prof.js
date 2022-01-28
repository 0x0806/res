'use strict';
common.skipIfInspectorDisabled();
const assert = require('assert');
const fs = require('fs');
const path = require('path');
const { spawnSync } = require('child_process');
function findFirstFrameInNode(root, func) {
  const first = root.children.find(
    (child) => child.callFrame.functionName === func
  );
  if (first) {
    return first;
  }
  for (const child of root.children) {
    const first = findFirstFrameInNode(child, func);
    if (first) {
      return first;
    }
  }
  return undefined;
}
function findFirstFrame(file, func) {
  const data = fs.readFileSync(file, 'utf8');
  const profile = JSON.parse(data);
  const first = findFirstFrameInNode(profile.head, func);
  return { frame: first, roots: profile.head.children };
}
function verifyFrames(output, file, func) {
  const { frame, roots } = findFirstFrame(file, func);
  if (!frame) {
    console.log(output.stderr.toString());
    console.log(roots);
  }
  assert.notDeepStrictEqual(frame, undefined);
}
const kHeapProfInterval = 128;
const TEST_ALLOCATION = kHeapProfInterval * 2;
const env = {
  ...process.env,
  TEST_ALLOCATION,
  NODE_DEBUG_NATIVE: 'INSPECTOR_PROFILER'
};
function getHeapProfiles(dir) {
  const list = fs.readdirSync(dir);
  return list
    .filter((file) => file.endsWith('.heapprofile'))
    .map((file) => path.join(dir, file));
}
{
  tmpdir.refresh();
  const dir = path.join(tmpdir.path, 'prof');
  const output = spawnSync(process.execPath, [
    '--heap-prof',
    '--diagnostic-dir',
    dir,
    '--heap-prof-interval',
    kHeapProfInterval,
    fixtures.path('workload', 'allocation.js'),
  ], {
    cwd: tmpdir.path,
    env
  });
  if (output.status !== 0) {
    console.log(output.stderr.toString());
  }
  assert.strictEqual(output.status, 0);
  assert(fs.existsSync(dir));
  const profiles = getHeapProfiles(dir);
  assert.strictEqual(profiles.length, 1);
  verifyFrames(output, profiles[0], 'runAllocation');
}
{
  tmpdir.refresh();
  const dir = path.join(tmpdir.path, 'diag');
  const dir2 = path.join(tmpdir.path, 'prof');
  const output = spawnSync(process.execPath, [
    '--heap-prof',
    '--heap-prof-interval',
    kHeapProfInterval,
    '--diagnostic-dir',
    dir,
    '--heap-prof-dir',
    dir2,
    fixtures.path('workload', 'allocation.js'),
  ], {
    cwd: tmpdir.path,
    env
  });
  if (output.status !== 0) {
    console.log(output.stderr.toString());
  }
  assert.strictEqual(output.status, 0);
  assert(fs.existsSync(dir2));
  const profiles = getHeapProfiles(dir2);
  assert.strictEqual(profiles.length, 1);
  verifyFrames(output, profiles[0], 'runAllocation');
}
