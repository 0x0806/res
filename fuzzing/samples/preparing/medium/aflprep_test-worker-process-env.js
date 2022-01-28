'use strict';
const child_process = require('child_process');
const assert = require('assert');
const { Worker, workerData } = require('worker_threads');
if (!workerData && process.argv[2] !== 'child') {
  process.env.SET_IN_PARENT = 'set';
  assert.strictEqual(process.env.SET_IN_PARENT, 'set');
  new Worker(__filename, { workerData: 'runInWorker' })
    .on('exit', common.mustCall(() => {
      assert.strictEqual(process.env.SET_IN_WORKER, undefined);
    }));
  process.env.SET_IN_PARENT_AFTER_CREATION = 'set';
  new Worker(__filename, {
    workerData: 'resetEnv',
    env: { 'MANUALLY_SET': true }
  });
  assert.throws(() => {
    new Worker(__filename, { env: 42 });
  }, {
    name: 'TypeError',
    code: 'ERR_INVALID_ARG_TYPE',
    message: 'The "options.env" property must be of type object or ' +
      'one of undefined, null, or worker_threads.SHARE_ENV. Received type ' +
      'number (42)'
  });
} else if (workerData === 'runInWorker') {
  assert.strictEqual(process.env.SET_IN_PARENT, 'set');
  assert.strictEqual(process.env.SET_IN_PARENT_AFTER_CREATION, undefined);
  process.env.SET_IN_WORKER = 'set';
  assert.strictEqual(process.env.SET_IN_WORKER, 'set');
  Object.defineProperty(process.env, 'DEFINED_IN_WORKER', { value: 42 });
  assert.strictEqual(process.env.DEFINED_IN_WORKER, '42');
  const { stderr } =
    child_process.spawnSync(process.execPath, [__filename, 'child']);
  assert.strictEqual(stderr.toString(), '', stderr.toString());
} else if (workerData === 'resetEnv') {
  assert.deepStrictEqual(Object.keys(process.env), ['MANUALLY_SET']);
  assert.strictEqual(process.env.MANUALLY_SET, 'true');
} else {
  assert.strictEqual(process.env.SET_IN_PARENT, 'set');
  assert.strictEqual(process.env.SET_IN_WORKER, 'set');
}
