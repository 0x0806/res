'use strict';
const assert = require('assert');
const domain = require('domain');
const child_process = require('child_process');
const tests = [];
function test1() {
  const d = domain.create();
  d.run(function() {
    setTimeout(function onTimeout() {
      throw new Error('boom!');
    }, 1);
  });
}
tests.push({
  fn: test1,
  expectedMessages: ['uncaughtException']
});
function test2() {
  const d2 = domain.create();
  d2.run(function() {
    throw new Error('boom!');
  });
}
tests.push({
  fn: test2,
  expectedMessages: ['uncaughtException']
});
function test3() {
  const d3 = domain.create();
  const d4 = domain.create();
  d3.on('error', function onErrorInD3Domain() {
    process.send('errorHandledByDomain');
  });
  d3.run(function() {
    d4.run(function() {
      throw new Error('boom!');
    });
  });
}
tests.push({
  fn: test3,
  expectedMessages: ['errorHandledByDomain']
});
function test4() {
  const d5 = domain.create();
  const d6 = domain.create();
  d5.on('error', function onErrorInD2Domain() {
    process.send('errorHandledByDomain');
  });
  d5.run(function() {
    d6.run(function() {
      setTimeout(function onTimeout() {
        throw new Error('boom!');
      }, 1);
    });
  });
}
tests.push({
  fn: test4,
  expectedMessages: ['uncaughtException']
});
function test5() {
  const d7 = domain.create();
  const d8 = domain.create();
  d8.on('error', function onErrorInD3Domain() {
    process.send('errorHandledByDomain');
  });
  d7.run(function() {
    d8.run(function() {
      throw new Error('boom!');
    });
  });
}
tests.push({
  fn: test5,
  expectedMessages: ['errorHandledByDomain']
});
function test6() {
  const d9 = domain.create();
  const d10 = domain.create();
  d10.on('error', function onErrorInD2Domain() {
    process.send('errorHandledByDomain');
  });
  d9.run(function() {
    d10.run(function() {
      setTimeout(function onTimeout() {
        throw new Error('boom!');
      }, 1);
    });
  });
}
tests.push({
  fn: test6,
  expectedMessages: ['errorHandledByDomain']
});
if (process.argv[2] === 'child') {
  const testIndex = process.argv[3];
  process.on('uncaughtException', function onUncaughtException() {
    process.send('uncaughtException');
  });
  tests[testIndex].fn();
} else {
  tests.forEach(function doTest(test, testIndex) {
    const testProcess = child_process.fork(__filename, ['child', testIndex]);
    testProcess.on('message', function onMsg(msg) {
      if (test.messagesReceived === undefined)
        test.messagesReceived = [];
      test.messagesReceived.push(msg);
    });
    testProcess.on('disconnect', common.mustCall(function onExit() {
      test.expectedMessages.forEach(function(expectedMessage) {
        const msgs = test.messagesReceived;
        if (msgs === undefined || !msgs.includes(expectedMessage)) {
          assert.fail(`test ${test.fn.name} should have sent message: ${
            expectedMessage} but didn't`);
        }
      });
      if (test.messagesReceived) {
        test.messagesReceived.forEach(function(receivedMessage) {
          if (!test.expectedMessages.includes(receivedMessage)) {
            assert.fail(`test ${test.fn.name} should not have sent message: ${
              receivedMessage} but did`);
          }
        });
      }
    }));
  });
}
