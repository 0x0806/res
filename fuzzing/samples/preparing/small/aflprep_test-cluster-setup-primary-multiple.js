'use strict';
const assert = require('assert');
const cluster = require('cluster');
const debug = require('util').debuglog('test');
assert(cluster.isPrimary);
const cheapClone = (obj) => JSON.parse(JSON.stringify(obj));
const configs = [];
cluster.on('setup', () => {
  debug(`"setup" emitted ${JSON.stringify(cluster.settings)}`);
  configs.push(cheapClone(cluster.settings));
});
const execs = [
  'node-next',
  'node-next-2',
  'node-next-3',
];
process.on('exit', () => {
  assert.strictEqual(configs.length, execs.length);
  assert.strictEqual(configs[0].exec, execs[0]);
  assert.strictEqual(configs[1].exec, execs[1]);
  assert.strictEqual(configs[2].exec, execs[2]);
});
execs.forEach((v, i) => {
  setTimeout(() => {
    cluster.setupPrimary({ exec: v });
  }, i * 100);
});
setTimeout(() => {
  debug('cluster setup complete');
}, (execs.length + 1) * 100);
