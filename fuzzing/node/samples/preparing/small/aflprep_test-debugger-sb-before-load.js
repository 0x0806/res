'use strict';
common.skipIfInspectorDisabled();
const assert = require('assert');
const path = require('path');
{
  const scriptFullPath = fixtures.path('debugger', 'cjs', 'index.js');
  const script = path.relative(process.cwd(), scriptFullPath);
  const otherScriptFullPath = fixtures.path('debugger', 'cjs', 'other.js');
  const otherScript = path.relative(process.cwd(), otherScriptFullPath);
  const cli = startCLI([script]);
  function onFatal(error) {
    cli.quit();
    throw error;
  }
  cli.waitForInitialBreak()
    .then(() => cli.waitForPrompt())
    .then(() => cli.command('sb("other.js", 2)'))
    .then(() => {
      assert.match(
        cli.output,
        'warns that the script was not loaded yet');
    })
    .then(() => cli.stepCommand('cont'))
    .then(() => {
      assert.ok(
        cli.output.includes(`break in ${otherScript}:2`),
        'found breakpoint in file that was not loaded yet');
    })
    .then(() => cli.quit())
    .then(null, onFatal);
}
