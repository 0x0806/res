'use strict';
common.skipIfInspectorDisabled();
const assert = require('assert');
async function runTests() {
  const child = new NodeInstance(['-e', `(${main.toString()})()`], '', '');
  const session = await child.connectInspectorSession();
  await session.send({ method: 'Runtime.enable' });
  await session.waitForConsoleOutput('log', 'before wait for debugger');
  assert.ok(!session.unprocessedNotifications()
                    .some((n) => n.method === 'Runtime.consoleAPICalled'));
  const { result: { value } } = await session.send({
    method: 'Runtime.evaluate',
    params: {
      expression: 'process._ws',
      includeCommandLineAPI: true
    }
  });
  session.send({ method: 'Runtime.runIfWaitingForDebugger' });
  await session.waitForConsoleOutput('log', 'after wait for debugger');
  await session.waitForConsoleOutput('log', 'before second wait for debugger');
  assert.ok(!session.unprocessedNotifications()
                    .some((n) => n.method === 'Runtime.consoleAPICalled'));
  const secondSession = await child.connectInspectorSession();
  secondSession.send({ method: 'Runtime.runIfWaitingForDebugger' });
  await session.waitForConsoleOutput('log', 'after second wait for debugger');
  assert.ok(!session.unprocessedNotifications()
                    .some((n) => n.method === 'Runtime.consoleAPICalled'));
  secondSession.disconnect();
  session.disconnect();
  function main(prefix) {
    const inspector = require('inspector');
    inspector.open(0, undefined, false);
    process._ws = inspector.url();
    console.log('before wait for debugger');
    inspector.waitForDebugger();
    console.log('after wait for debugger');
    console.log('before second wait for debugger');
    inspector.waitForDebugger();
    console.log('after second wait for debugger');
  }
  assert.throws(() => require('inspector').waitForDebugger(), re);
}
runTests().then(common.mustCall());
