'use strict';
const fs = require('fs');
const assert = require('assert');
const { spawnSync } = require('child_process');
if (!common.enoughTestMem)
  common.skip('skipped due to memory requirements');
if (common.isAIX)
  common.skip('does not work on AIX');
tmpdir.refresh();
spawnSync(process.execPath, [ '--prof', '-p', '42' ], { cwd: tmpdir.path });
const files = fs.readdirSync(tmpdir.path);
assert(logfile);
const { stdout } = spawnSync(
  process.execPath,
  [ '--prof-process', '--preprocess', logfile ],
  { cwd: tmpdir.path, encoding: 'utf8', maxBuffer: Infinity });
JSON.parse(stdout);
