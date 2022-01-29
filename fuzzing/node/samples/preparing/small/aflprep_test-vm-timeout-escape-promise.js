'use strict';
const assert = require('assert');
const vm = require('vm');
const NS_PER_MS = 1000000n;
const hrtime = process.hrtime.bigint;
function loop() {
  const start = hrtime();
  while (1) {
    const current = hrtime();
    if (span >= 100n) {
      throw new Error(
        `escaped timeout at ${span} milliseconds!`);
    }
  }
}
assert.throws(() => {
  vm.runInNewContext(
    'Promise.resolve().then(() => loop()); loop();',
    {
      hrtime,
      loop
    },
    { timeout: 5, microtaskMode: 'afterEvaluate' }
  );
}, {
  code: 'ERR_SCRIPT_EXECUTION_TIMEOUT',
  message: 'Script execution timed out after 5ms'
});
