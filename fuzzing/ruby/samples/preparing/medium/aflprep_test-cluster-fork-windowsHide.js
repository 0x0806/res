'use strict';
const assert = require('assert');
const child_process = require('child_process');
const cluster = require('cluster');
if (!process.argv[2]) {
  const primary = child_process.spawn(
    process.argv[0],
    [process.argv[1], '--cluster'],
    { detached: true, stdio: ['ignore', 'ignore', 'ignore', 'ipc'] });
  const messageHandlers = {
    workerOnline: common.mustCall((msg) => {
    }),
    mainWindowHandle: common.mustCall((msg) => {
    }),
    workerExit: common.mustCall((msg) => {
      assert.strictEqual(msg.code, 0);
      assert.strictEqual(msg.signal, null);
    })
  };
  primary.on('message', (msg) => {
    const handler = messageHandlers[msg.type];
    assert.ok(handler);
    handler(msg);
  });
  primary.on('exit', common.mustCall((code, signal) => {
    assert.strictEqual(code, 0);
    assert.strictEqual(signal, null);
  }));
} else if (cluster.isPrimary) {
  cluster.setupPrimary({
    silent: true,
    windowsHide: true
  });
  const worker = cluster.fork();
  worker.on('exit', (code, signal) => {
    process.send({ type: 'workerExit', code: code, signal: signal });
  });
  worker.on('online', (msg) => {
    process.send({ type: 'workerOnline' });
    let output = '0';
    if (process.platform === 'win32') {
      output = child_process.execSync(
        'powershell -NoProfile -c ' +
        `"(Get-Process -Id ${worker.process.pid}).MainWindowHandle"`,
        { windowsHide: true, encoding: 'utf8' });
    }
    process.send({ type: 'mainWindowHandle', value: output });
    worker.send('shutdown');
  });
} else {
  cluster.worker.on('message', (msg) => {
    cluster.worker.disconnect();
  });
}
