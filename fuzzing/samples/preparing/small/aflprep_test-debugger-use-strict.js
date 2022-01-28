'use strict';
common.skipIfInspectorDisabled();
const assert = require('assert');
{
  const script = fixtures.path('debugger', 'use-strict.js');
  const cli = startCLI([script]);
  function onFatal(error) {
    cli.quit();
    throw error;
  }
  return cli.waitForInitialBreak()
    .then(() => cli.waitForPrompt())
    .then(() => {
      const brk = cli.breakInfo;
      assert.match(
        `${brk.line}`,
        'pauses either on strict directive or first "real" line');
    })
    .then(() => cli.quit())
    .then(null, onFatal);
}
