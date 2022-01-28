'use strict';
common.skipIfInspectorDisabled();
const assert = require('assert');
const { Session } = require('inspector');
const path = require('path');
const { pathToFileURL } = require('url');
const { isMainThread, parentPort, Worker, workerData } =
    require('worker_threads');
if (!workerData) {
  common.skipIfWorker();
}
function toDebug() {
  let a = 1;
  a = a + 1;
  return a * 200;
}
const messagesSent = [];
async function post(session, method, params) {
  return new Promise((resolve, reject) => {
    session.post(method, params, (error, success) => {
      messagesSent.push(method);
      if (error) {
        process._rawDebug(`Message ${method} produced an error`);
        reject(error);
      } else {
        process._rawDebug(`Message ${method} was sent`);
        resolve(success);
      }
    });
  });
}
async function waitForNotification(session, notification) {
  return new Promise((resolve) => session.once(notification, resolve));
}
function startWorker(skipChild, sharedBuffer) {
  return new Promise((resolve) => {
    const worker = new Worker(__filename, {
      workerData: { skipChild, sharedBuffer }
    });
    worker.on('error', (e) => {
      console.error(e);
      throw e;
    });
    let resolveConsoleRequest;
    let resolveMessagesSent;
    worker.onConsoleRequest =
      new Promise((resolve) => resolveConsoleRequest = resolve);
    worker.onMessagesSent =
      new Promise((resolve) => resolveMessagesSent = resolve);
    worker.on('message', (m) => {
      resolve(worker);
      if (m.doConsoleLog) resolveConsoleRequest();
      if (m.messagesSent) resolveMessagesSent(m.messagesSent);
    });
  });
}
function doConsoleLog(arrayBuffer) {
  console.log('Message for a test');
  arrayBuffer[0] = 128;
}
async function ensureListenerDoesNotInterrupt(session) {
  await new Promise(setImmediate);
  const currentTime = Date.now();
  let consoleLogHappened = false;
  session.once('Runtime.consoleAPICalled',
               () => { consoleLogHappened = true; });
  const buf = new Uint8Array(workerData.sharedBuffer);
  parentPort.postMessage({ doConsoleLog: true });
  while (buf[0] === 1) {
  }
  while ((Date.now() - currentTime) < 50) {
  }
  assert.strictEqual(consoleLogHappened, false);
  await new Promise(queueMicrotask);
  assert.strictEqual(consoleLogHappened, true);
}
async function main() {
  const sharedBuffer = new SharedArrayBuffer(1);
  const arrayBuffer = new Uint8Array(sharedBuffer);
  arrayBuffer[0] = 1;
  const worker = await startWorker(false, sharedBuffer);
  worker.onConsoleRequest.then(doConsoleLog.bind(null, arrayBuffer));
  assert.strictEqual(toDebug(), 400);
  assert.deepStrictEqual(await worker.onMessagesSent, [
    'Debugger.enable',
    'Runtime.enable',
    'Debugger.setBreakpointByUrl',
    'Debugger.evaluateOnCallFrame',
    'Debugger.resume',
  ]);
}
async function childMain() {
  parentPort.on('message', () => { });
  await (await startWorker(true)).onMessagesSent;
  const session = new Session();
  session.connectToMainThread();
  await post(session, 'Debugger.enable');
  await post(session, 'Runtime.enable');
  await post(session, 'Debugger.setBreakpointByUrl', {
    'lineNumber': 18,
    'url': pathToFileURL(path.resolve(__dirname, __filename)).toString(),
    'columnNumber': 0,
    'condition': ''
  });
  const pausedPromise = waitForNotification(session, 'Debugger.paused');
  parentPort.postMessage('Ready');
  const callFrameId = (await pausedPromise).params.callFrames[0].callFrameId;
  await new Promise((resolve) => setTimeout(resolve, 50));
  const { result: { value } } =
      await post(session,
                 'Debugger.evaluateOnCallFrame',
                 { callFrameId, expression: 'a * 100' });
  assert.strictEqual(value, 100);
  await post(session, 'Debugger.resume');
  await ensureListenerDoesNotInterrupt(session);
  parentPort.postMessage({ messagesSent });
  parentPort.close();
  console.log('Worker is done');
}
async function skipChildMain() {
  parentPort.on('message', () => { });
  const session = new Session();
  session.connectToMainThread();
  const notifications = [];
  session.on('NodeWorker.attachedToWorker', (n) => notifications.push(n));
  await post(session, 'NodeWorker.enable', { waitForDebuggerOnStart: false });
  assert.strictEqual(notifications.length, 2);
  parentPort.postMessage('Ready');
  parentPort.postMessage({ messagesSent });
  parentPort.close();
  console.log('Skip child is done');
}
if (isMainThread) {
  main().then(common.mustCall());
} else if (workerData.skipChild) {
  skipChildMain().then(common.mustCall());
} else {
  childMain().then(common.mustCall());
}
