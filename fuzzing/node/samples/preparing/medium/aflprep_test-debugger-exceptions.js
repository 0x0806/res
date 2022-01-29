'use strict';
common.skipIfInspectorDisabled();
const assert = require('assert');
const path = require('path');
{
  const scriptFullPath = fixtures.path('debugger', 'exceptions.js');
  const script = path.relative(process.cwd(), scriptFullPath);
  const cli = startCLI([script]);
  function onFatal(error) {
    cli.quit();
    throw error;
  }
  cli.waitForInitialBreak()
    .then(() => cli.waitForPrompt())
    .then(() => {
      assert.deepStrictEqual(cli.breakInfo, { filename: script, line: 1 });
    })
    .then(() => cli.command('c'))
    .then(() => cli.stepCommand('r'))
    .then(() => cli.waitForInitialBreak())
    .then(() => {
      assert.deepStrictEqual(cli.breakInfo, { filename: script, line: 1 });
    })
    .then(() => cli.command('breakOnException'))
    .then(() => cli.stepCommand('c'))
    .then(() => {
      assert.ok(cli.output.includes(`exception in ${script}:3`));
    })
    .then(() => cli.stepCommand('c'))
    .then(() => {
      assert.ok(cli.output.includes(`exception in ${script}:9`));
    })
    .then(() => cli.command('breakOnUncaught'))
    .then(() => cli.waitForInitialBreak())
    .then(() => {
      assert.deepStrictEqual(cli.breakInfo, { filename: script, line: 1 });
    })
    .then(() => cli.stepCommand('c'))
    .then(() => {
      assert.ok(cli.output.includes(`exception in ${script}:9`));
    })
    .then(() => cli.command('breakOnNone'))
    .then(() => cli.stepCommand('r'))
    .then(() => cli.waitForInitialBreak())
    .then(() => {
      assert.deepStrictEqual(cli.breakInfo, { filename: script, line: 1 });
    })
    .then(() => cli.command('c'))
    .then(() => cli.quit())
    .then(null, onFatal);
}
