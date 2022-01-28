'use strict';
const assert = require('assert');
const { fork } = require('child_process');
const args = ['foo', 'bar'];
const debug = require('util').debuglog('test');
const n = fork(fixtures.path('child-process-spawn-node.js'), args);
assert.strictEqual(n.channel, n._channel);
assert.deepStrictEqual(args, ['foo', 'bar']);
n.on('message', (m) => {
  debug('PARENT got message:', m);
  assert.ok(m.foo);
});
assert.throws(() => n.send(undefined), {
  name: 'TypeError',
  message: 'The "message" argument must be specified',
  code: 'ERR_MISSING_ARGS'
});
assert.throws(() => n.send(), {
  name: 'TypeError',
  message: 'The "message" argument must be specified',
  code: 'ERR_MISSING_ARGS'
});
assert.throws(() => n.send(Symbol()), {
  name: 'TypeError',
  message: 'The "message" argument must be one of type string,' +
           ' object, number, or boolean. Received type symbol (Symbol())',
  code: 'ERR_INVALID_ARG_TYPE'
});
n.send({ hello: 'world' });
n.on('exit', common.mustCall((c) => {
  assert.strictEqual(c, 0);
}));
