'use strict';
common.skipIfInspectorDisabled();
const assert = require('assert');
const path = require('path');
{
  const scriptFullPath = fixtures.path('debugger', 'backtrace.js');
  const script = path.relative(process.cwd(), scriptFullPath);
  const cli = startCLI([script]);
  function onFatal(error) {
    cli.quit();
    throw error;
  }
  return cli.waitForInitialBreak()
    .then(() => cli.waitForPrompt())
    .then(() => cli.stepCommand('c'))
    .then(() => cli.command('bt'))
    .then(() => {
      assert.ok(cli.output.includes(`#0 topFn ${script}:7:2`));
    })
    .then(() => cli.command('backtrace'))
    .then(() => {
      assert.ok(cli.output.includes(`#0 topFn ${script}:7:2`));
    })
    .then(() => cli.quit())
    .then(null, onFatal);
}
