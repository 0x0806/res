'use strict';
const path = require('path');
const assert = require('assert');
const { Worker } = require('worker_threads');
{
  const expectedErr = {
    code: 'ERR_WORKER_PATH',
    name: 'TypeError'
  };
  const existingRelPathNoDot = path.relative('.', __filename);
  assert.throws(() => { new Worker(existingRelPathNoDot); }, expectedErr);
  assert.throws(() => { new Worker('relative_no_dot'); }, expectedErr);
}
{
  assert.throws(
  );
  assert.throws(
  );
  assert.throws(
    () => { new Worker('relative_no_dot'); },
  );
}
{
  const expectedErr = {
    code: 'ERR_INVALID_URL_SCHEME',
    name: 'TypeError'
  };
                expectedErr);
}
