'use strict';
common.skipIfInspectorDisabled();
common.skipIf32Bits();
const assert = require('assert');
const script = `
process._rawDebug('Waiting until a signal enables the inspector...');
let waiting = setInterval(waitUntilDebugged, 50);
function waitUntilDebugged() {
  if (!internalBinding('inspector').isEnabled()) return;
  clearInterval(waiting);
  process._rawDebug('Signal received, waiting for debugger setup');
  waiting = setInterval(() => { debugger; }, 50);
}
function setupTimeoutWithBreak() {
  clearInterval(waiting);
  process._rawDebug('Debugger ready, setting up timeout with a break');
  setTimeout(() => { debugger; }, 50);
}
`;
async function waitForInitialSetup(session) {
  console.error('[test]', 'Waiting for initial setup');
  await session.waitForBreakOnLine(16, '[eval]');
}
async function setupTimeoutForStackTrace(session) {
  console.error('[test]', 'Setting up timeout for async stack trace');
  await session.send([
    { 'method': 'Runtime.evaluate',
      'params': { expression: 'setupTimeoutWithBreak()' } },
    { 'method': 'Debugger.resume' },
  ]);
}
async function checkAsyncStackTrace(session) {
  console.error('[test]', 'Verify basic properties of asyncStackTrace');
  const paused = await session.waitForBreakOnLine(23, '[eval]');
  assert(paused.params.asyncStackTrace,
         `${Object.keys(paused.params)} contains "asyncStackTrace" property`);
  assert(paused.params.asyncStackTrace.description, 'Timeout');
  assert(paused.params.asyncStackTrace.callFrames
           .some((frame) => frame.functionName === 'setupTimeoutWithBreak'));
}
async function runTests() {
  const instance = await NodeInstance.startViaSignal(script);
  const session = await instance.connectInspectorSession();
  await session.send([
    { 'method': 'Runtime.enable' },
    { 'method': 'Debugger.enable' },
    { 'method': 'Debugger.setAsyncCallStackDepth',
      'params': { 'maxDepth': 10 } },
    { 'method': 'Debugger.setBlackboxPatterns',
      'params': { 'patterns': [] } },
    { 'method': 'Runtime.runIfWaitingForDebugger' },
  ]);
  await waitForInitialSetup(session);
  await setupTimeoutForStackTrace(session);
  await checkAsyncStackTrace(session);
  console.error('[test]', 'Stopping child instance');
  session.disconnect();
  instance.kill();
}
runTests().then(common.mustCall());
