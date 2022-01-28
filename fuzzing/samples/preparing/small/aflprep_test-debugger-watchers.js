'use strict';
common.skipIfInspectorDisabled();
const assert = require('assert');
{
  function onFatal(error) {
    cli.quit();
    throw error;
  }
  return cli.waitForInitialBreak()
    .then(() => cli.waitForPrompt())
    .then(() => cli.command('watch("x")'))
    .then(() => cli.command('watch("\\"Hello\\"")'))
    .then(() => cli.command('watch("42")'))
    .then(() => cli.command('watch("NaN")'))
    .then(() => cli.command('watch("true")'))
    .then(() => cli.command('watch("[1, 2]")'))
    .then(() => cli.command('watch("process.env")'))
    .then(() => cli.command('watchers'))
    .then(() => {
    })
    .then(() => cli.command('unwatch("42")'))
    .then(() => cli.stepCommand('n'))
    .then(() => {
      assert.match(
        cli.output,
        'shows "..." for process.env');
    })
    .then(() => cli.quit())
    .then(null, onFatal);
}
