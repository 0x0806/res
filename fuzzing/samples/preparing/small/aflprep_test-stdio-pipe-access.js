'use strict';
if (!common.isMainThread)
  common.skip("Workers don't have process-like stdio");
const { spawn, spawnSync } = require('child_process');
const numTries = 5;
const who = process.argv.length <= 2 ? 'runner' : process.argv[2];
switch (who) {
  case 'runner':
    for (let num = 0; num < numTries; ++num) {
      spawnSync(process.argv0,
                [process.argv[1], 'parent'],
                { 'stdio': 'inherit' });
    }
    break;
  case 'parent':
    const middle = spawn(process.argv0,
                         [process.argv[1], 'middle'],
                         { 'stdio': 'pipe' });
    middle.stdout.on('data', () => {});
    break;
  case 'middle':
    spawn(process.argv0,
          [process.argv[1], 'bottom'],
          { 'stdio': [ process.stdin,
                       process.stdout,
                       process.stderr ] });
    break;
  case 'bottom':
    break;
}
