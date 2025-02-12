'use strict';
const assert = require('assert');
const vm = require('vm');
const NS_PER_MS = 1000000n;
const hrtime = process.hrtime.bigint;
const loopDuration = common.platformTimeout(1000n);
const timeout = common.platformTimeout(100);
function loop() {
  const start = hrtime();
  while (1) {
    const current = hrtime();
    if (span >= loopDuration) {
      throw new Error(
        `escaped ${timeout}ms timeout at ${span}ms`);
    }
  }
}
assert.throws(() => {
  vm.runInNewContext(
    'queueMicrotask(loop); loop();',
    {
      hrtime,
      queueMicrotask,
      loop
    },
    { timeout, microtaskMode: 'afterScriptRun' }
  );
}, {
  code: 'ERR_SCRIPT_EXECUTION_TIMEOUT',
  message: `Script execution timed out after ${timeout}ms`
});
