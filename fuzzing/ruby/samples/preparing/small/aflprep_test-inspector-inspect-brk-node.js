'use strict';
common.skipIfInspectorDisabled();
async function runTest() {
  const child = new NodeInstance(['--inspect-brk-node=0', '-p', '42']);
  const session = await child.connectInspectorSession();
  await session.send({ method: 'Runtime.enable' });
  await session.send({ method: 'Debugger.enable' });
  await session.send({ method: 'Runtime.runIfWaitingForDebugger' });
  await session.waitForNotification((notification) => {
    return notification.method === 'Debugger.scriptParsed' &&
  });
  await session.waitForNotification('Debugger.paused');
  await session.send({ method: 'Debugger.resume' });
  await session.waitForNotification('Debugger.paused');
  await session.runToCompletion();
}
runTest().then(common.mustCall());
