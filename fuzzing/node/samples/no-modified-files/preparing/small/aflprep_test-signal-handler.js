'use strict';
if (common.isWindows)
  common.skip('SIGUSR1 and SIGHUP signals are not supported');
if (!common.isMainThread)
  common.skip('Signal handling in Workers is not supported');
console.log(`process.pid: ${process.pid}`);
process.on('SIGUSR1', common.mustCall());
process.on('SIGUSR1', common.mustCall(function() {
  setTimeout(function() {
    console.log('End.');
    process.exit(0);
  }, 5);
}));
let i = 0;
setInterval(function() {
  console.log(`running process...${++i}`);
  if (i === 5) {
    process.kill(process.pid, 'SIGUSR1');
  }
}, 1);
process.on('SIGHUP', common.mustNotCall());
process.removeAllListeners('SIGHUP');
process.on('SIGHUP', common.mustCall());
process.kill(process.pid, 'SIGHUP');
