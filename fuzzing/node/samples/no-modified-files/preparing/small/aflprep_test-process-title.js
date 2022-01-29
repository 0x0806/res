'use strict';
const { spawnSync } = require('child_process');
const { strictEqual } = require('assert');
if (common.isSunOS)
  common.skip(`Unsupported platform [${process.platform}]`);
if (common.isIBMi)
  common.skip('Unsupported platform IBMi');
if (common.isWindows)
  process.title = process.execPath;
const xs = 'x'.repeat(1024);
const proc = spawnSync(process.execPath, ['-p', 'process.title', xs]);
strictEqual(proc.stdout.toString().trim(), process.execPath);
