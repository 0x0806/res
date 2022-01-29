'use strict';
if (!common.hasCrypto)
  common.skip('missing crypto');
const assert = require('assert');
const child_process = require('child_process');
const path = require('path');
process.env.NODE_DEBUG_NATIVE = 'http2';
process.env.NODE_DEBUG = 'http2';
const { stdout, stderr } = child_process.spawnSync(process.execPath, [
  path.resolve(__dirname, 'test-http2-ping.js'),
], { encoding: 'utf8' });
       stderr);
       stderr);
       stderr);
       stderr);
       stderr);
       stderr);
assert.strictEqual(stdout.trim(), '');
