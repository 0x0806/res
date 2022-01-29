'use strict';
common.skipIfInspectorDisabled();
common.skipIfWorker();
const assert = require('assert');
const { Worker } = require('worker_threads');
const { Session } = require('inspector');
const session = new Session();
let done = false;
function onAttachToWorker({ params: { sessionId } }) {
  let id = 1;
  function postToWorkerInspector(method, params) {
    session.post('NodeWorker.sendMessageToWorker', {
      sessionId,
      message: JSON.stringify({ id: id++, method, params })
    }, () => console.log(`Message ${method} received the response`));
  }
  function onMessageReceived({ params: { message } }) {
    if (!message ||
      JSON.parse(message).method !== 'NodeRuntime.waitingForDisconnect') {
      session.once('NodeWorker.receivedMessageFromWorker', onMessageReceived);
      return;
    }
    postToWorkerInspector('Debugger.setAsyncCallStackDepth', { maxDepth: 1 });
    session.post('NodeWorker.detach', { sessionId }, () => {
      done = true;
    });
  }
  onMessageReceived({ params: { message: null } });
  postToWorkerInspector('Debugger.enable');
  postToWorkerInspector('NodeRuntime.notifyWhenWaitingForDisconnect',
                        { enabled: true });
  postToWorkerInspector('Runtime.runIfWaitingForDebugger');
}
session.connect();
session.on('NodeWorker.attachedToWorker', common.mustCall(onAttachToWorker));
session.post('NodeWorker.enable', { waitForDebuggerOnStart: true }, () => {
  new Worker('console.log("Worker is done")', { eval: true })
    .once('exit', () => {
      setTimeout(() => {
        assert.strictEqual(done, true);
        console.log('Test is done');
      }, 0);
    });
});
