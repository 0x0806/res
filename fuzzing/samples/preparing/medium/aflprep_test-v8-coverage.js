'use strict';
if (!process.features.inspector) return;
const assert = require('assert');
const fs = require('fs');
const path = require('path');
const { spawnSync } = require('child_process');
tmpdir.refresh();
let dirc = 0;
function nextdir() {
  return `cov_${++dirc}`;
}
{
  const coverageDirectory = path.join(tmpdir.path, nextdir());
  const output = spawnSync(process.execPath, [
  ], { env: { ...process.env, NODE_V8_COVERAGE: coverageDirectory } });
  if (output.status !== 0) {
    console.log(output.stderr.toString());
  }
  assert.strictEqual(output.status, 0);
  assert.strictEqual(output.stderr.toString(), '');
  const fixtureCoverage = getFixtureCoverage('basic.js', coverageDirectory);
  assert.ok(fixtureCoverage);
  assert.strictEqual(fixtureCoverage.functions[0].ranges[0].count, 1);
  assert.strictEqual(fixtureCoverage.functions[0].ranges[1].count, 0);
}
{
  const coverageDirectory = path.join(tmpdir.path, nextdir());
  const output = spawnSync(process.execPath, [
  ], { env: { ...process.env, NODE_V8_COVERAGE: coverageDirectory } });
  if (output.status !== 1) {
    console.log(output.stderr.toString());
  }
  assert.strictEqual(output.status, 1);
  const fixtureCoverage = getFixtureCoverage('throw.js', coverageDirectory);
  assert.ok(fixtureCoverage, 'coverage not found for file');
  assert.strictEqual(fixtureCoverage.functions[0].ranges[0].count, 1);
  assert.strictEqual(fixtureCoverage.functions[0].ranges[1].count, 0);
}
{
  const coverageDirectory = path.join(tmpdir.path, nextdir());
  const output = spawnSync(process.execPath, [
  ], { env: { ...process.env, NODE_V8_COVERAGE: coverageDirectory } });
  if (output.status !== 1) {
    console.log(output.stderr.toString());
  }
  assert.strictEqual(output.status, 1);
  assert.strictEqual(output.stderr.toString(), '');
  const fixtureCoverage = getFixtureCoverage('exit-1.js', coverageDirectory);
  assert.ok(fixtureCoverage, 'coverage not found for file');
  assert.strictEqual(fixtureCoverage.functions[0].ranges[0].count, 1);
  assert.strictEqual(fixtureCoverage.functions[0].ranges[1].count, 0);
}
{
  const coverageDirectory = path.join(tmpdir.path, nextdir());
  const output = spawnSync(process.execPath, [
  ], { env: { ...process.env, NODE_V8_COVERAGE: coverageDirectory } });
  if (!common.isWindows) {
    if (output.signal !== 'SIGINT') {
      console.log(output.stderr.toString());
    }
    assert.strictEqual(output.signal, 'SIGINT');
  }
  assert.strictEqual(output.stderr.toString(), '');
  const fixtureCoverage = getFixtureCoverage('sigint.js', coverageDirectory);
  assert.ok(fixtureCoverage);
  assert.strictEqual(fixtureCoverage.functions[0].ranges[0].count, 1);
  assert.strictEqual(fixtureCoverage.functions[0].ranges[1].count, 0);
}
{
  const coverageDirectory = path.join(tmpdir.path, nextdir());
  const output = spawnSync(process.execPath, [
  ], { env: { ...process.env, NODE_V8_COVERAGE: coverageDirectory } });
  if (output.status !== 0) {
    console.log(output.stderr.toString());
  }
  assert.strictEqual(output.status, 0);
  assert.strictEqual(output.stderr.toString(), '');
  const fixtureCoverage = getFixtureCoverage('subprocess.js',
                                             coverageDirectory);
  assert.ok(fixtureCoverage);
  assert.strictEqual(fixtureCoverage.functions[1].ranges[0].count, 1);
  assert.strictEqual(fixtureCoverage.functions[1].ranges[1].count, 0);
}
{
  const coverageDirectory = path.join(tmpdir.path, nextdir());
  const output = spawnSync(process.execPath, [
  ], { env: { ...process.env, NODE_V8_COVERAGE: coverageDirectory } });
  if (output.status !== 0) {
    console.log(output.stderr.toString());
  }
  assert.strictEqual(output.status, 0);
  assert.strictEqual(output.stderr.toString(), '');
  const fixtureCoverage = getFixtureCoverage('subprocess.js',
                                             coverageDirectory);
  assert.ok(fixtureCoverage);
  assert.strictEqual(fixtureCoverage.functions[1].ranges[0].count, 1);
  assert.strictEqual(fixtureCoverage.functions[1].ranges[1].count, 0);
}
{
  const coverageDirectory = path.join(tmpdir.path, nextdir());
  const output = spawnSync(process.execPath, [
  ], { env: { ...process.env, NODE_V8_COVERAGE: coverageDirectory } });
  if (output.status !== 0) {
    console.log(output.stderr.toString());
  }
  assert.strictEqual(output.status, 0);
  assert.strictEqual(output.stderr.toString(), '');
  const fixtureCoverage = getFixtureCoverage('subprocess.js',
                                             coverageDirectory);
  assert.strictEqual(fixtureCoverage, undefined);
}
{
  const coverageDirectory = path.join(tmpdir.path, nextdir());
  const output = spawnSync(process.execPath, [
  ], { env: { ...process.env, NODE_V8_COVERAGE: coverageDirectory } });
  if (output.status !== 0) {
    console.log(output.stderr.toString());
  }
  assert.strictEqual(output.status, 0);
  assert.strictEqual(output.stderr.toString(), '');
  const fixtureCoverage = getFixtureCoverage('async-hooks.js',
                                             coverageDirectory);
  assert.ok(fixtureCoverage);
  assert.strictEqual(fixtureCoverage.functions[0].ranges[0].count, 1);
}
{
  const coverageDirectory = nextdir();
  const absoluteCoverageDirectory = path.join(tmpdir.path, coverageDirectory);
  const output = spawnSync(process.execPath, [
  ], {
    cwd: tmpdir.path,
    env: { ...process.env, NODE_V8_COVERAGE: coverageDirectory }
  });
  if (output.status !== 0) {
    console.log(output.stderr.toString());
  }
  assert.strictEqual(output.status, 0);
  assert.strictEqual(output.stderr.toString(), '');
  const fixtureCoverage = getFixtureCoverage('basic.js',
                                             absoluteCoverageDirectory);
  assert.ok(fixtureCoverage);
  assert.strictEqual(fixtureCoverage.functions[0].ranges[0].count, 1);
  assert.strictEqual(fixtureCoverage.functions[0].ranges[1].count, 0);
}
function getFixtureCoverage(fixtureFile, coverageDirectory) {
  const coverageFiles = fs.readdirSync(coverageDirectory);
  for (const coverageFile of coverageFiles) {
    const coverage = require(path.join(coverageDirectory, coverageFile));
    for (const fixtureCoverage of coverage.result) {
        return fixtureCoverage;
      }
    }
  }
}
