'use strict';
common.skipIfInspectorDisabled();
const assert = require('assert');
function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
{
  function onFatal(error) {
    cli.quit();
    throw error;
  }
  return cli.waitForInitialBreak()
    .then(() => cli.waitForPrompt())
    .then(() => cli.command('exec console.profile()'))
    .then(() => {
    })
    .then(() => cli.command('exec console.profileEnd()'))
    .then(() => delay(250))
    .then(() => {
    })
    .then(() => cli.quit())
    .then(null, onFatal);
}
