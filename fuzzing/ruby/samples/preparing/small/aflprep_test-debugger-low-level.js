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
    .then(() => cli.command('scripts'))
    .then(() => {
      const [, scriptId] = cli.output.match(scriptPattern);
      return cli.command(
        `Debugger.getScriptSource({ scriptId: '${scriptId}' })`
      );
    })
    .then(() => {
      assert.match(
        cli.output,
      assert.match(
        cli.output,
    })
    .then(() => cli.quit())
    .then(null, onFatal);
}
