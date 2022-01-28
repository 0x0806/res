'use strict';
common.skipIfInspectorDisabled();
const assert = require('assert');
const path = require('path');
{
  const scriptFullPath = fixtures.path('debugger', 'break.js');
  const script = path.relative(process.cwd(), scriptFullPath);
  const cli = startCLI([script]);
  function onFatal(error) {
    cli.quit();
    throw error;
  }
  cli.waitForInitialBreak()
    .then(() => cli.waitForPrompt())
    .then(() => {
      assert.deepStrictEqual(
        cli.breakInfo,
        { filename: script, line: 1 },
      );
      assert.match(
        cli.output,
        'shows the source and marks the current line');
    })
    .then(() => cli.stepCommand('n'))
    .then(() => {
      assert.ok(
        cli.output.includes(`break in ${script}:2`),
        'pauses in next line of the script');
      assert.match(
        cli.output,
        'marks the 2nd line');
    })
    .then(() => cli.stepCommand('next'))
    .then(() => {
      assert.ok(
        cli.output.includes(`break in ${script}:3`),
        'pauses in next line of the script');
      assert.match(
        cli.output,
        'marks the 3nd line');
    })
    .then(() => cli.stepCommand('cont'))
    .then(() => {
      assert.ok(
        cli.output.includes(`break in ${script}:10`),
        'pauses on the next breakpoint');
      assert.match(
        cli.output,
        'marks the debugger line');
    })
    .then(() => cli.command('sb("break.js", 6)'))
    .then(() => cli.command('sb("otherFunction()")'))
    .then(() => cli.command('sb(16)'))
    .then(() => cli.command('breakpoints'))
    .then(() => {
      assert.ok(cli.output.includes(`#0 ${script}:6`));
      assert.ok(cli.output.includes(`#1 ${script}:16`));
    })
    .then(() => cli.command('list()'))
    .then(() => {
      assert.match(
        cli.output,
        'prints and marks current line'
      );
      assert.deepStrictEqual(
        cli.parseSourceLines(),
        [5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15],
      );
    })
    .then(() => cli.command('list(2)'))
    .then(() => {
      assert.match(
        cli.output,
        'prints and marks current line'
      );
      assert.deepStrictEqual(
        cli.parseSourceLines(),
        [8, 9, 10, 11, 12],
      );
    })
    .then(() => cli.stepCommand('s'))
    .then(() => cli.stepCommand(''))
    .then(() => {
      assert.match(
        cli.output,
        'entered timers.js');
    })
    .then(() => cli.stepCommand('cont'))
    .then(() => {
      assert.ok(
        cli.output.includes(`break in ${script}:16`),
    })
    .then(() => cli.stepCommand('cont'))
    .then(() => {
      assert.ok(
        cli.output.includes(`break in ${script}:6`),
    })
    .then(() => cli.stepCommand(''))
    .then(() => {
      assert.ok(
        cli.output.includes(`debugCommand in ${script}:14`),
        'found function breakpoint we set above');
    })
    .then(() => cli.quit())
    .then(null, onFatal);
}
