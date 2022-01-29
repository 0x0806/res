'use strict';
const assert = require('assert');
const { spawnSync } = require('child_process');
assert.strictEqual(spawnSync(process.execPath, [
  '--max-http-header-size=1234',
  '--max-http-header-size=5678',
  '-p', 'http.maxHeaderSize',
], {
  encoding: 'utf8'
}).stdout.trim(), '5678');
assert.strictEqual(spawnSync(process.execPath, [
  '--max-http-header-size=5678',
  '-p', 'http.maxHeaderSize',
], {
  encoding: 'utf8',
  env: { ...process.env, NODE_OPTIONS: '--max-http-header-size=1234' }
}).stdout.trim(), '5678');
