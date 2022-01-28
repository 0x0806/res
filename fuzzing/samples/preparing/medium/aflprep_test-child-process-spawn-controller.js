'use strict';
const assert = require('assert');
const { spawn } = require('child_process');
const aliveScript = fixtures.path('child-process-stay-alive-forever.js');
{
  const controller = new AbortController();
  const { signal } = controller;
  const cp = spawn(process.execPath, [aliveScript], {
    signal,
  });
  cp.on('exit', common.mustCall((code, killSignal) => {
    assert.strictEqual(code, null);
    assert.strictEqual(killSignal, 'SIGTERM');
  }));
  cp.on('error', common.mustCall((e) => {
    assert.strictEqual(e.name, 'AbortError');
  }));
  controller.abort();
}
{
  const signal = AbortSignal.abort();
  const cp = spawn(process.execPath, [aliveScript], {
    signal,
  });
  cp.on('exit', common.mustCall((code, killSignal) => {
    assert.strictEqual(code, null);
    assert.strictEqual(killSignal, 'SIGTERM');
  }));
  cp.on('error', common.mustCall((e) => {
    assert.strictEqual(e.name, 'AbortError');
  }));
}
{
  const controller = new AbortController();
  const { signal } = controller;
  const cp = spawn(process.execPath, [aliveScript], {
    signal,
  });
  cp.on('exit', common.mustCall((code, killSignal) => {
    assert.strictEqual(code, null);
    assert.strictEqual(killSignal, 'SIGTERM');
  }));
  cp.on('error', common.mustCall((e) => {
    assert.strictEqual(e.name, 'AbortError');
  }));
  setTimeout(() => controller.abort(), 1);
}
{
  const controller = new AbortController();
  const { signal } = controller;
  const cp = spawn(process.execPath, [aliveScript], {
    signal,
    killSignal: 'SIGKILL',
  });
  cp.on('exit', common.mustCall((code, killSignal) => {
    assert.strictEqual(code, null);
    assert.strictEqual(killSignal, 'SIGKILL');
  }));
  cp.on('error', common.mustCall((e) => {
    assert.strictEqual(e.name, 'AbortError');
  }));
  setTimeout(() => controller.abort(), 1);
}
{
  const controller = new AbortController();
  const { signal } = controller;
  const cp = spawn(process.execPath, [aliveScript], {
    signal,
  });
  cp.on('exit', common.mustCall(() => {
    controller.abort();
  }));
  cp.on('error', common.mustNotCall());
  setTimeout(() => cp.kill(), 1);
}
