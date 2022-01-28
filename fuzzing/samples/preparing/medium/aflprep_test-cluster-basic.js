'use strict';
const assert = require('assert');
const cluster = require('cluster');
assert.strictEqual('NODE_UNIQUE_ID' in process.env, false,
                   `NODE_UNIQUE_ID (${process.env.NODE_UNIQUE_ID}) ` +
                   'should be removed on startup');
function forEach(obj, fn) {
  Object.keys(obj).forEach((name, index) => {
    fn(obj[name], name, index);
  });
}
if (cluster.isWorker) {
  require('http').Server(common.mustNotCall()).listen(0, '127.0.0.1');
} else if (cluster.isPrimary) {
  const checks = {
    cluster: {
      events: {
        fork: false,
        online: false,
        listening: false,
        exit: false
      },
      equal: {
        fork: false,
        online: false,
        listening: false,
        exit: false
      }
    },
    worker: {
      events: {
        online: false,
        listening: false,
        exit: false
      },
      equal: {
        online: false,
        listening: false,
        exit: false
      },
      states: {
        none: false,
        online: false,
        listening: false,
        dead: false
      }
    }
  };
  const stateNames = Object.keys(checks.worker.states);
  forEach(checks.cluster.events, (bool, name, index) => {
      checks.cluster.events[name] = true;
      checks.cluster.equal[name] = worker === arguments[0];
      const state = stateNames[index];
      checks.worker.states[state] = (state === worker.state);
    }));
  });
  cluster.on('listening', common.mustCall(() => {
    worker.kill();
  }));
  cluster.on('exit', common.mustCall());
  const worker = cluster.fork();
  assert.strictEqual(worker.id, 1);
  assert(worker instanceof cluster.Worker,
         'the worker is not a instance of the Worker constructor');
  forEach(checks.worker.events, function(bool, name, index) {
    worker.on(name, common.mustCall(function() {
      checks.worker.events[name] = true;
      checks.worker.equal[name] = (worker === this);
      switch (name) {
        case 'exit':
          assert.strictEqual(arguments[0], worker.process.exitCode);
          assert.strictEqual(arguments[1], worker.process.signalCode);
          assert.strictEqual(arguments.length, 2);
          break;
        case 'listening':
          assert.strictEqual(arguments.length, 1);
          assert.strictEqual(Object.keys(arguments[0]).length, 4);
          assert.strictEqual(arguments[0].address, '127.0.0.1');
          assert.strictEqual(arguments[0].addressType, 4);
          assert(arguments[0].hasOwnProperty('fd'));
          assert.strictEqual(arguments[0].fd, undefined);
          const port = arguments[0].port;
          assert(Number.isInteger(port));
          assert(port >= 1);
          assert(port <= 65535);
          break;
        default:
          assert.strictEqual(arguments.length, 0);
          break;
      }
    }));
  });
  process.once('exit', () => {
    forEach(checks.cluster.events, (check, name) => {
      assert(check,
             `The cluster event "${name}" on the cluster object did not fire`);
    });
    forEach(checks.cluster.equal, (check, name) => {
      assert(check,
             `The cluster event "${name}" did not emit with correct argument`);
    });
    forEach(checks.worker.states, (check, name) => {
      assert(check,
             `The worker state "${name}" was not set to true`);
    });
    forEach(checks.worker.events, (check, name) => {
      assert(check,
             `The worker event "${name}" on the worker object did not fire`);
    });
    forEach(checks.worker.equal, (check, name) => {
      assert(check,
             `The worker event "${name}" did not emit with correct argument`);
    });
  });
}
