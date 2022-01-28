'use strict';
if (process.config.variables.arm_version === '7') {
  common.skip('Too slow for armv7 bots');
}
let complete = 0;
(function runner() {
  if (++complete < 1e8)
    process.nextTick(runner);
}());
setImmediate(function() {
  console.log('ok');
});
