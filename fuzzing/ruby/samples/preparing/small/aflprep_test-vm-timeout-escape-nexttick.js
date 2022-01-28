'use strict';
const assert = require('assert');
const vm = require('vm');
const NS_PER_MS = 1000000n;
const hrtime = process.hrtime.bigint;
const nextTick = process.nextTick;
const waitDuration = common.platformTimeout(100n);
function loop() {
  const start = hrtime();
  while (1) {
    const current = hrtime();
    if (span >= waitDuration) {
      throw new Error(
        `escaped timeout at ${span} milliseconds!`);
    }
  }
}
for (let i = 0; i < 4; i++) {
  assert.throws(() => {
    vm.runInNewContext(
      'nextTick(loop); loop();',
      {
        hrtime,
        nextTick,
        loop
      },
      { timeout: common.platformTimeout(10) }
    );
  }, {
    code: 'ERR_SCRIPT_EXECUTION_TIMEOUT'
  });
}
