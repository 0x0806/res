'use strict';
common.skipIfInspectorDisabled();
const assert = require('assert');
{
  const script = fixtures.path('debugger', 'three-lines.js');
  const cli = startCLI([script]);
  cli.waitForInitialBreak()
    .then(() => cli.waitForPrompt())
    .then(() => {
      assert.match(
        cli.output,
        'forwards child output');
    })
    .then(() => cli.command('["hello", "world"].join(" ")'))
    .then(() => {
    })
    .then(() => cli.command(''))
    .then(() => {
      assert.match(
        cli.output,
        'repeats the last command on <enter>'
      );
    })
    .then(() => cli.command('version'))
    .then(() => {
      assert.ok(
        cli.output.includes(process.versions.v8),
        'version prints the v8 version'
      );
    })
    .then(() => cli.quit())
    .then((code) => {
      assert.strictEqual(code, 0);
    });
}
