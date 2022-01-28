'use strict';
const assert = require('assert');
const expectedError = { code: 'ERR_INVALID_ARG_VALUE', name: 'TypeError' };
assert.throws(() => getValidStdio('foo'), expectedError);
assert.throws(() => getValidStdio(600), expectedError);
{
  const stdio1 = [];
  const result = getValidStdio(stdio1, false);
  assert.strictEqual(stdio1.length, 3);
  assert.strictEqual(result.hasOwnProperty('stdio'), true);
  assert.strictEqual(result.hasOwnProperty('ipc'), true);
  assert.strictEqual(result.hasOwnProperty('ipcFd'), true);
}
const stdio2 = ['ipc', 'ipc', 'ipc'];
assert.throws(() => getValidStdio(stdio2, true),
              { code: 'ERR_IPC_SYNC_FORK', name: 'Error' }
);
{
  const stdio = ['foo'];
  assert.throws(() => getValidStdio(stdio, false),
                { code: 'ERR_INVALID_SYNC_FORK_INPUT', name: 'TypeError' }
  );
}
{
  const stdio = [{ foo: 'bar' }];
  assert.throws(() => getValidStdio(stdio), expectedError);
}
if (common.isMainThread) {
  const stdio3 = [process.stdin, process.stdout, process.stderr];
  const result = getValidStdio(stdio3, false);
  assert.deepStrictEqual(result, {
    stdio: [
      { type: 'fd', fd: 0 },
      { type: 'fd', fd: 1 },
      { type: 'fd', fd: 2 },
    ],
    ipc: undefined,
    ipcFd: undefined
  });
} else {
  common.printSkipMessage(
    'stdio is not associated with file descriptors in Workers');
}
