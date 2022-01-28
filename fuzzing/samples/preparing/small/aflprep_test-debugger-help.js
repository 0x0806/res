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
    .then(() => cli.command('help'))
    .then(() => {
    })
    .then(() => cli.quit())
    .then(null, onFatal);
}
