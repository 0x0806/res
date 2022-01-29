'use strict';
common.skipIfInspectorDisabled();
{
  const script = fixtures.path('debugger', 'three-lines.js');
  const cli = startCLI([script]);
  function onFatal(error) {
    cli.quit();
    throw error;
  }
  cli.waitForInitialBreak()
    .then(() => cli.waitForPrompt())
    .then(() => cli.command('setBreakpoint(1)'))
    .then(() => cli.command('setBreakpoint(1)'))
    .then(() => cli.quit())
    .then(null, onFatal);
}
