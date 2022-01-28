'use strict';
const assert = require('assert');
const util = require('util');
const sleep = util.promisify(setTimeout);
const promisesInitState = new Map();
const promisesExecutionState = new Map();
const hooks = initHooks({
  oninit,
  onbefore,
  onafter,
  onpromiseResolve
});
hooks.enable();
function oninit(asyncId, type) {
  if (type === 'PROMISE') {
    promisesInitState.set(asyncId, 'inited');
  }
}
function onbefore(asyncId) {
  if (!promisesInitState.has(asyncId)) {
    return;
  }
  promisesExecutionState.set(asyncId, 'before');
}
function onafter(asyncId) {
  if (!promisesInitState.has(asyncId)) {
    return;
  }
  assert.strictEqual(promisesExecutionState.get(asyncId), 'before',
                     'after hook called for promise without prior call' +
                     'to before hook');
  assert.strictEqual(promisesInitState.get(asyncId), 'resolved',
                     'after hook called for promise without prior call' +
                     'to resolve hook');
  promisesExecutionState.set(asyncId, 'after');
}
function onpromiseResolve(asyncId) {
  assert(promisesInitState.has(asyncId),
         'resolve hook called for promise without prior call to init hook');
  promisesInitState.set(asyncId, 'resolved');
}
const timeout = common.platformTimeout(10);
function checkPromisesInitState() {
  for (const initState of promisesInitState.values()) {
    assert.strictEqual(initState, 'resolved');
  }
}
function checkPromisesExecutionState() {
  for (const executionState of promisesExecutionState.values()) {
    assert.strictEqual(executionState, 'after');
  }
}
process.on('beforeExit', common.mustCall(() => {
  hooks.disable();
  hooks.sanityCheck('PROMISE');
  checkPromisesInitState();
  checkPromisesExecutionState();
}));
async function asyncFunc() {
  await sleep(timeout);
}
asyncFunc();
