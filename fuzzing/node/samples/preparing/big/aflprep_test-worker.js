'use strict';
const assert = require('assert');
const path = require('path');
const { Worker } = require('worker_threads');
const assertError = (error) => {
  assert.strictEqual(error.code, 'ERR_DLOPEN_DISABLED');
  assert.strictEqual(
    error.message,
    'Cannot load native addon because loading addons is disabled.'
  );
};
{
  const worker = new Worker(`require(${JSON.stringify(binding)})`, {
    eval: true,
  });
  worker.on('error', common.mustCall(assertError));
}
{
  const worker = new Worker(
    `process.dlopen({ exports: {} }, ${JSON.stringify(binding)});`,
    {
      eval: true,
    }
  );
  worker.on('error', common.mustCall(assertError));
}
{
  const worker = new Worker(`require(${JSON.stringify(binding)})`, {
    eval: true,
    execArgv: ['--no-addons'],
  });
  worker.on('error', common.mustCall(assertError));
}
{
  const worker = new Worker(`require(${JSON.stringify(binding)})`, {
    eval: true,
    execArgv: [],
  });
  worker.on('error', common.mustCall(assertError));
}
