'use strict';
common.skipIfInspectorDisabled();
const assert = require('assert');
const path = require('path');
{
  const scriptFullPath = fixtures.path('debugger', 'three-lines.js');
  const script = path.relative(process.cwd(), scriptFullPath);
  const cli = startCLI([script]);
  function onFatal(error) {
    cli.quit();
    throw error;
  }
  cli.waitForInitialBreak()
    .then(() => cli.waitForPrompt())
    .then(() => cli.stepCommand('n'))
    .then(() => {
      assert.ok(
        cli.output.includes(`break in ${script}:2`),
        'steps to the 2nd line'
      );
    })
    .then(() => cli.command('cont'))
    .then(() => {
      assert.match(
        cli.output,
        'the child was done');
    })
    .then(() => {
      return cli.command('kill');
    })
    .then(() => cli.command('cont'))
    .then(() => {
    })
    .then(() => cli.stepCommand('run'))
    .then(() => cli.waitForInitialBreak())
    .then(() => cli.waitForPrompt())
    .then(() => {
      assert.deepStrictEqual(
        cli.breakInfo,
        { filename: script, line: 1 },
      );
    })
    .then(() => cli.stepCommand('n'))
    .then(() => {
      assert.deepStrictEqual(
        cli.breakInfo,
        { filename: script, line: 2 },
      );
    })
    .then(() => cli.stepCommand('restart'))
    .then(() => cli.waitForInitialBreak())
    .then(() => {
      assert.deepStrictEqual(
        cli.breakInfo,
        { filename: script, line: 1 },
      );
    })
    .then(() => cli.command('kill'))
    .then(() => cli.command('cont'))
    .then(() => {
    })
    .then(() => cli.stepCommand('run'))
    .then(() => cli.waitForInitialBreak())
    .then(() => cli.waitForPrompt())
    .then(() => {
      assert.deepStrictEqual(
        cli.breakInfo,
        { filename: script, line: 1 },
      );
    })
    .then(() => cli.quit())
    .then(null, onFatal);
}
