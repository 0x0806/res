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
assert.rejects(async () => {
  const module = new vm.SourceTextModule(
    'Promise.resolve().then(() => loop());',
    {
      context: vm.createContext({
        hrtime,
        loop
      }, { microtaskMode: 'afterEvaluate' })
    });
  await module.link(common.mustNotCall());
  await module.evaluate({ timeout: 10 });
}, {
  code: 'ERR_SCRIPT_EXECUTION_TIMEOUT',
  message: 'Script execution timed out after 10ms'
});
