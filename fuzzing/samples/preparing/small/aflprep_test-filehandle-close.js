'use strict';
const assert = require('assert');
const fs = require('fs');
(async function() {
  const fh = await fs.promises.open(__filename);
  fs.closeSync(fh.fd);
  assert.rejects(() => fh.close(), {
    code: 'EBADF',
    syscall: 'close'
  });
})().then(common.mustCall());
