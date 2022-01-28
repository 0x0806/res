'use strict';
common.skipIfInspectorDisabled();
const assert = require('assert');
{
  const script = fixtures.path('debugger', 'three-lines.js');
  const cli = startCLI(['--port=0', script]);
  cli.waitForInitialBreak()
    .then(() => cli.waitForPrompt())
    .then(() => {
      assert.match(
        cli.output,
        'forwards child output');
    })
    .then(() => cli.quit())
    .then((code) => {
      assert.strictEqual(code, 0);
    });
}
