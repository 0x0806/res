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
    .then(() => cli.stepCommand('c'))
    .then(() => cli.command('exec .scope'))
    .then(() => {
      assert.match(
        cli.output,
      assert.doesNotMatch(
        cli.output,
        'omits global scope'
      );
    })
    .then(() => cli.quit())
    .then(null, onFatal);
}
