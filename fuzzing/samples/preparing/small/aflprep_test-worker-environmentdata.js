'use strict';
const {
  Worker,
  getEnvironmentData,
  setEnvironmentData,
  threadId,
} = require('worker_threads');
const {
  deepStrictEqual,
  strictEqual,
} = require('assert');
if (!process.env.HAS_STARTED_WORKER) {
  process.env.HAS_STARTED_WORKER = 1;
  setEnvironmentData('foo', 'bar');
  setEnvironmentData('hello', { value: 'world' });
  setEnvironmentData(1, 2);
  strictEqual(getEnvironmentData(1), 2);
  new Worker(__filename);
} else {
  strictEqual(getEnvironmentData('foo'), 'bar');
  deepStrictEqual(getEnvironmentData('hello'), { value: 'world' });
  strictEqual(getEnvironmentData(1), undefined);
  if (threadId <= 2)
    new Worker(__filename);
}
