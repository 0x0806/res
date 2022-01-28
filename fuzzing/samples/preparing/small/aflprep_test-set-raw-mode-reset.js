'use strict';
const child_process = require('child_process');
child_process.spawnSync(process.execPath, [
  '-e', 'process.stdin.setRawMode(true)',
], { stdio: 'inherit' });
const { stdout } = child_process.spawnSync('stty', {
  stdio: ['inherit', 'pipe', 'inherit'],
  encoding: 'utf8'
});
  console.log(stdout);
}
