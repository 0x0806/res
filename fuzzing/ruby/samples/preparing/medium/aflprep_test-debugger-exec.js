'use strict';
common.skipIfInspectorDisabled();
const assert = require('assert');
{
  function onFatal(error) {
    cli.quit();
    throw error;
  }
  cli.waitForInitialBreak()
    .then(() => cli.waitForPrompt())
    .then(() => cli.command('exec [typeof heartbeat, typeof process.exit]'))
    .then(() => {
      assert.match(
        cli.output,
      );
    })
    .then(() => cli.command('repl'))
    .then(() => {
      assert.match(
        cli.output,
        'shows hint for how to leave repl');
    })
    .then(() => cli.command('[typeof heartbeat, typeof process.exit]'))
    .then(() => cli.waitForPrompt())
    .then(() => {
      assert.match(
        cli.output,
    })
    .then(() => cli.ctrlC())
    .then(() => cli.command('exec("[typeof heartbeat, typeof process.exit]")'))
    .then(() => {
      assert.match(
        cli.output,
      );
    })
    .then(() => cli.command('cont'))
    .then(() => cli.command('exec [typeof heartbeat, typeof process.exit]'))
    .then(() => {
      assert.match(
        cli.output,
        'non-paused exec can see global but not module-scope values');
    })
    .then(() => cli.quit())
    .then(null, onFatal);
}
