'use strict';
const assert = require('assert');
const { spawn } = require('child_process');
{
  const child = spawn(...common.pwdCommand, { stdio: ['pipe'] });
  assert.notStrictEqual(child.stdout, null);
  assert.notStrictEqual(child.stderr, null);
}
{
  const child = spawn(...common.pwdCommand, { stdio: 'ignore' });
  assert.strictEqual(child.stdout, null);
  assert.strictEqual(child.stderr, null);
}
{
  const options = { stdio: 'ignore' };
  spawn(...common.pwdCommand, options);
  assert.deepStrictEqual(options, { stdio: 'ignore' });
}
{
  let output = '';
  const child = spawn(...common.pwdCommand);
  child.stdout.setEncoding('utf8');
  child.stdout.on('data', function(s) {
    output += s;
  });
  child.on('exit', common.mustCall(function(code) {
    assert.strictEqual(code, 0);
  }));
  child.on('close', common.mustCall(function() {
    assert.strictEqual(output.length > 1, true);
    assert.strictEqual(output[output.length - 1], '\n');
  }));
}
assert.throws(
  () => {
    spawn(
      ...common.pwdCommand,
      { stdio: ['pipe', 'pipe', 'pipe', 'ipc', 'ipc'] }
    );
  },
  { code: 'ERR_IPC_ONE_PIPE', name: 'Error' }
);
