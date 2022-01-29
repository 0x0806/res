'use strict';
const assert = require('assert');
const fs = require('fs').promises;
(async () => {
  const filehandle = await fs.open(__filename);
  assert.notStrictEqual(filehandle.fd, -1);
  await filehandle.close();
  assert.strictEqual(filehandle.fd, -1);
  const otherFilehandle = await fs.open(process.execPath);
  assert.rejects(() => filehandle.stat(), {
    code: 'EBADF',
    syscall: 'fstat'
  });
  await otherFilehandle.close();
})().then(common.mustCall());
