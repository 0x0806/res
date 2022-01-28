'use strict';
const assert = require('assert');
const domain = require('domain');
let threw = false;
let stage = -1;
const QUEUE = 10;
const errObj = {
  name: 'Error',
  message: 'setImmediate Err'
};
process.once('uncaughtException', common.mustCall((err, errorOrigin) => {
  assert.strictEqual(errorOrigin, 'uncaughtException');
  assert.strictEqual(stage, 0);
  common.expectsError(errObj)(err);
}));
const d1 = domain.create();
d1.once('error', common.expectsError(errObj));
d1.once('error', () => assert.strictEqual(stage, 0));
const run = common.mustCall((callStage) => {
  assert(callStage >= stage);
  stage = callStage;
  if (threw)
    return;
  setImmediate(run, 2);
}, QUEUE * 3);
for (let i = 0; i < QUEUE; i++)
  setImmediate(run, 0);
setImmediate(() => {
  threw = true;
  process.nextTick(() => assert.strictEqual(stage, 1));
  throw new Error('setImmediate Err');
});
d1.run(() => setImmediate(() => {
  throw new Error('setImmediate Err');
}));
for (let i = 0; i < QUEUE; i++)
  setImmediate(run, 1);
