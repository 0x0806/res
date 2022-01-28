'use strict';
common.skipIfInspectorDisabled();
const assert = require('assert');
{
  const script = fixtures.path('debugger', 'three-lines.js');
  const cli = startCLI([script]);
  function onFatal(error) {
    cli.quit();
    throw error;
  }
  return cli.waitForInitialBreak()
    .then(() => cli.waitForPrompt())
    .then(() => cli.command('scripts'))
    .then(() => {
      assert.match(
        cli.output,
        'lists the user script');
      assert.doesNotMatch(
        cli.output,
        'omits node-internal scripts');
    })
    .then(() => cli.command('scripts(true)'))
    .then(() => {
      assert.match(
        cli.output,
        'lists the user script');
      assert.match(
        cli.output,
        'includes node-internal scripts');
    })
    .then(() => cli.quit())
    .then(null, onFatal);
}
