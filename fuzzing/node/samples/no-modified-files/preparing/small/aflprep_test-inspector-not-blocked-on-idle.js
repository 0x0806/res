'use strict';
common.skipIfInspectorDisabled();
async function runTests() {
  const script = 'setInterval(() => {debugger;}, 60000);';
  const node = new NodeInstance('--inspect=0', script);
  await new Promise((resolve) => setTimeout(() => resolve(), 1000));
  const session = await node.connectInspectorSession();
  await session.send([
    { 'method': 'Debugger.enable' },
    { 'method': 'Debugger.pause' },
  ]);
  session.disconnect();
  node.kill();
}
runTests().then(common.mustCall());
