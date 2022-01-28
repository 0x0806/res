'use strict';
common.skipIfInspectorDisabled();
const path = require('path');
tmpdir.refresh();
const { readFileSync } = require('fs');
const filename = path.join(tmpdir.path, 'node.heapsnapshot');
{
  const opts = { cwd: tmpdir.path };
  function onFatal(error) {
    cli.quit();
    throw error;
  }
  return cli.waitForInitialBreak()
    .then(() => cli.waitForPrompt())
    .then(() => cli.command('takeHeapSnapshot()'))
    .then(() => JSON.parse(readFileSync(filename, 'utf8')))
    .then(() => cli.command('takeHeapSnapshot(); takeHeapSnapshot()'))
    .then(() => JSON.parse(readFileSync(filename, 'utf8')))
    .then(() => cli.quit())
    .then(null, onFatal);
}
