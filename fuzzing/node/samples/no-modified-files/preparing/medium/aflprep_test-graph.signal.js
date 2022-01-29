'use strict';
if (common.isWindows)
  common.skip('no signals on Windows');
if (!common.isMainThread)
  common.skip('No signal handling available in Workers');
const { exec } = require('child_process');
const hooks = initHooks();
hooks.enable();
process.on('SIGUSR2', common.mustCall(onsigusr2, 2));
let count = 0;
exec(`kill -USR2 ${process.pid}`);
function onsigusr2() {
  count++;
  if (count === 1) {
    exec(`kill -USR2 ${process.pid}`);
  } else {
    process.removeAllListeners('SIGUSR2');
    process.on('SIGUSR2', common.mustCall(onsigusr2Again));
    exec(`kill -USR2 ${process.pid}`);
  }
}
function onsigusr2Again() {
}
process.on('exit', onexit);
function onexit() {
  hooks.disable();
  verifyGraph(
    hooks,
    [ { type: 'SIGNALWRAP', id: 'signal:1', triggerAsyncId: null },
      { type: 'PROCESSWRAP', id: 'process:1', triggerAsyncId: null },
      { type: 'PIPEWRAP', id: 'pipe:1', triggerAsyncId: null },
      { type: 'PIPEWRAP', id: 'pipe:2', triggerAsyncId: null },
      { type: 'PIPEWRAP', id: 'pipe:3', triggerAsyncId: null },
      { type: 'PROCESSWRAP', id: 'process:2', triggerAsyncId: 'signal:1' },
      { type: 'PIPEWRAP', id: 'pipe:4', triggerAsyncId: 'signal:1' },
      { type: 'PIPEWRAP', id: 'pipe:5', triggerAsyncId: 'signal:1' },
      { type: 'PIPEWRAP', id: 'pipe:6', triggerAsyncId: 'signal:1' },
      { type: 'SIGNALWRAP', id: 'signal:2',
        triggerAsyncId: process.env.TEST_THREAD_ID ? 'signal:1' : 'pipe:2' },
      { type: 'PROCESSWRAP', id: 'process:3', triggerAsyncId: 'signal:1' },
      { type: 'PIPEWRAP', id: 'pipe:7', triggerAsyncId: 'signal:1' },
      { type: 'PIPEWRAP', id: 'pipe:8', triggerAsyncId: 'signal:1' },
      { type: 'PIPEWRAP', id: 'pipe:9', triggerAsyncId: 'signal:1' } ]
  );
}
