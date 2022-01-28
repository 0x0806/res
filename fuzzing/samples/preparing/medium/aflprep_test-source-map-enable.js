'use strict';
if (!process.features.inspector) return;
const assert = require('assert');
const { dirname } = require('path');
const fs = require('fs');
const path = require('path');
const { spawnSync } = require('child_process');
const { pathToFileURL } = require('url');
tmpdir.refresh();
let dirc = 0;
function nextdir() {
  return process.env.NODE_V8_COVERAGE ||
    path.join(tmpdir.path, `source_map_${++dirc}`);
}
{
  const coverageDirectory = nextdir();
  const output = spawnSync(process.execPath, [
  ], { env: { ...process.env, NODE_V8_COVERAGE: coverageDirectory } });
  if (output.status !== 0) {
    console.log(output.stderr.toString());
  }
  assert.strictEqual(output.status, 0);
  assert.strictEqual(output.stderr.toString(), '');
  const sourceMap = getSourceMapFromCache('basic.js', coverageDirectory);
}
{
  const coverageDirectory = nextdir();
  const output = spawnSync(process.execPath, [
  ], { env: { ...process.env, NODE_V8_COVERAGE: coverageDirectory } });
  if (!common.isWindows) {
    if (output.signal !== 'SIGINT') {
      console.log(output.stderr.toString());
    }
    assert.strictEqual(output.signal, 'SIGINT');
  }
  assert.strictEqual(output.stderr.toString(), '');
  const sourceMap = getSourceMapFromCache('sigint.js', coverageDirectory);
}
{
  const coverageDirectory = nextdir();
  const output = spawnSync(process.execPath, [
  ], { env: { ...process.env, NODE_V8_COVERAGE: coverageDirectory } });
  assert.strictEqual(output.stderr.toString(), '');
  const sourceMap = getSourceMapFromCache('exit-1.js', coverageDirectory);
}
{
  const coverageDirectory = nextdir();
  const output = spawnSync(process.execPath, [
    '--no-warnings',
  ], { env: { ...process.env, NODE_V8_COVERAGE: coverageDirectory } });
  assert.strictEqual(output.stderr.toString(), '');
  const sourceMap = getSourceMapFromCache('esm-basic.mjs', coverageDirectory);
}
{
  const coverageDirectory = nextdir();
  const output = spawnSync(process.execPath, [
  ], { env: { ...process.env, NODE_V8_COVERAGE: coverageDirectory } });
  assert.strictEqual(output.status, 0);
  assert.strictEqual(output.stderr.toString(), '');
  const sourceMap = getSourceMapFromCache(
    'disk-relative-path.js',
    coverageDirectory
  );
  assert.strictEqual(
    dirname(pathToFileURL(
    dirname(sourceMap.data.sources[0])
  );
}
{
  const coverageDirectory = nextdir();
  const output = spawnSync(process.execPath, [
  ], { env: { ...process.env, NODE_V8_COVERAGE: coverageDirectory } });
  assert.strictEqual(output.status, 0);
  assert.strictEqual(output.stderr.toString(), '');
  const sourceMap = getSourceMapFromCache(
    'inline-base64.js',
    coverageDirectory
  );
  assert.strictEqual(
    dirname(pathToFileURL(
    dirname(sourceMap.data.sources[0])
  );
}
{
  const coverageDirectory = nextdir();
  const output = spawnSync(process.execPath, [
  ], { env: { ...process.env, NODE_V8_COVERAGE: coverageDirectory } });
  assert.strictEqual(output.status, 0);
  assert.strictEqual(output.stderr.toString(), '');
  const sourceMap = getSourceMapFromCache(
    'inline-base64-type-error.js',
    coverageDirectory
  );
  assert.strictEqual(sourceMap.data, null);
}
{
  const coverageDirectory = nextdir();
  const output = spawnSync(process.execPath, [
  ], { env: { ...process.env, NODE_V8_COVERAGE: coverageDirectory } });
  assert.strictEqual(output.status, 0);
  assert.strictEqual(output.stderr.toString(), '');
  const sourceMap = getSourceMapFromCache(
    'inline-base64-json-error.js',
    coverageDirectory
  );
  assert.strictEqual(sourceMap.data, null);
}
{
  const output = spawnSync(process.execPath, [
  ]);
  assert.strictEqual(
    null
  );
  assert.strictEqual(
    null
  );
}
{
  const output = spawnSync(process.execPath, [
    '--enable-source-maps',
  ]);
  assert.match(
    output.stderr.toString(),
  );
  assert.match(
    output.stderr.toString(),
  );
}
{
  const output = spawnSync(process.execPath, [
    '--enable-source-maps',
  ]);
}
{
  const output = spawnSync(process.execPath, [
    '--enable-source-maps',
  ]);
  assert.ok(
  );
}
{
  const output = spawnSync(process.execPath, [
    '--enable-source-maps',
  ]);
  assert.ok(
  );
  assert.ok(
  );
}
{
  const output = spawnSync(process.execPath, [
    '--enable-source-maps',
  ]);
  assert.ok(
  );
}
{
  const coverageDirectory = nextdir();
  spawnSync(process.execPath, [
  ], { env: { ...process.env, NODE_V8_COVERAGE: coverageDirectory } });
  const sourceMap = getSourceMapFromCache(
    'inline-base64.js',
    coverageDirectory
  );
  assert.strictEqual(sourceMap.url, null);
}
{
  const coverageDirectory = nextdir();
  spawnSync(process.execPath, [
  ], { env: { ...process.env, NODE_V8_COVERAGE: coverageDirectory } });
  const sourceMap = getSourceMapFromCache(
    'istanbul-throw.js',
    coverageDirectory
  );
  if (common.checkoutEOL === '\r\n') {
    assert.deepStrictEqual(sourceMap.lineLengths, [1086, 31, 185, 649, 0]);
  } else {
    assert.deepStrictEqual(sourceMap.lineLengths, [1085, 30, 184, 648, 0]);
  }
}
{
  const output = spawnSync(process.execPath, [
    '--enable-source-maps',
  ]);
  assert.ok(
    output.stderr.toString().match('emptyStackError')
  );
}
{
  const output = spawnSync(process.execPath, [
    '--enable-source-maps',
  ]);
  assert.match(
    output.stderr.toString(),
  );
}
{
  const coverageDirectory = nextdir();
  const output = spawnSync(process.execPath, [
    '--enable-source-maps',
  ], { env: { ...process.env, NODE_V8_COVERAGE: coverageDirectory } });
  const sourceMap = getSourceMapFromCache(
    'throw-on-require.js',
    coverageDirectory
  );
  assert.ok(sourceMap);
}
{
  const coverageDirectory = nextdir();
  const output = spawnSync(process.execPath, [
    '--enable-source-maps',
  ], { env: { ...process.env, NODE_V8_COVERAGE: coverageDirectory } });
  const sourceMap = getSourceMapFromCache(
    'throw-string.js',
    coverageDirectory
  );
  assert.ok(sourceMap);
}
{
  const coverageDirectory = nextdir();
  const output = spawnSync(process.execPath, [
    '--enable-source-maps',
  ], { env: { ...process.env, NODE_V8_COVERAGE: coverageDirectory } });
  const sourceMap = getSourceMapFromCache(
    'esm-export-missing.mjs',
    coverageDirectory
  );
  assert.match(output.stderr.toString(),
  assert.ok(sourceMap);
}
function getSourceMapFromCache(fixtureFile, coverageDirectory) {
  const jsonFiles = fs.readdirSync(coverageDirectory);
  for (const jsonFile of jsonFiles) {
    let maybeSourceMapCache;
    try {
      maybeSourceMapCache = require(
        path.join(coverageDirectory, jsonFile)
      )['source-map-cache'] || {};
    } catch (err) {
      console.warn(err);
      maybeSourceMapCache = {};
    }
    const keys = Object.keys(maybeSourceMapCache);
    for (const key of keys) {
      if (key.includes(fixtureFile)) {
        return maybeSourceMapCache[key];
      }
    }
  }
}
