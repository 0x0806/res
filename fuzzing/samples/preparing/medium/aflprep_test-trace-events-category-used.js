'use strict';
const assert = require('assert');
const cp = require('child_process');
const CODE = `
  const { isTraceCategoryEnabled } = internalBinding('trace_events');
  console.log(
    isTraceCategoryEnabled("custom")
  );
`;
tmpdir.refresh();
const procEnabled = cp.spawn(
  process.execPath,
  [ '--trace-event-categories', 'custom',
    '--no-warnings',
    '--expose-internals',
    '-e', CODE ],
  { cwd: tmpdir.path }
);
let procEnabledOutput = '';
procEnabled.stdout.on('data', (data) => procEnabledOutput += data);
procEnabled.stderr.pipe(process.stderr);
procEnabled.once('close', common.mustCall(() => {
  assert.strictEqual(procEnabledOutput, 'true\n');
}));
const procDisabled = cp.spawn(
  process.execPath,
  [ '--trace-event-categories', 'other',
    '--no-warnings',
    '--expose-internals',
    '-e', CODE ],
  { cwd: tmpdir.path }
);
let procDisabledOutput = '';
procDisabled.stdout.on('data', (data) => procDisabledOutput += data);
procDisabled.stderr.pipe(process.stderr);
procDisabled.once('close', common.mustCall(() => {
  assert.strictEqual(procDisabledOutput, 'false\n');
}));
