'use strict';
const { strictEqual } = require('assert');
const { fork } = require('child_process');
{
  const ac = new AbortController();
  const { signal } = ac;
  const cp = fork(fixtures.path('child-process-stay-alive-forever.js'), {
    signal
  });
  cp.on('exit', mustCall((code, killSignal) => {
    strictEqual(code, null);
    strictEqual(killSignal, 'SIGTERM');
  }));
  cp.on('error', mustCall((err) => {
    strictEqual(err.name, 'AbortError');
  }));
  process.nextTick(() => ac.abort());
}
{
  const signal = AbortSignal.abort();
  const cp = fork(fixtures.path('child-process-stay-alive-forever.js'), {
    signal
  });
  cp.on('exit', mustCall((code, killSignal) => {
    strictEqual(code, null);
    strictEqual(killSignal, 'SIGTERM');
  }));
  cp.on('error', mustCall((err) => {
    strictEqual(err.name, 'AbortError');
  }));
}
{
  const signal = AbortSignal.abort();
  const cp = fork(fixtures.path('child-process-stay-alive-forever.js'), {
    signal,
    killSignal: 'SIGKILL',
  });
  cp.on('exit', mustCall((code, killSignal) => {
    strictEqual(code, null);
    strictEqual(killSignal, 'SIGKILL');
  }));
  cp.on('error', mustCall((err) => {
    strictEqual(err.name, 'AbortError');
  }));
}
{
  const ac = new AbortController();
  const { signal } = ac;
  const cp = fork(fixtures.path('child-process-stay-alive-forever.js'), {
    signal
  });
  cp.on('exit', mustCall(() => {
    ac.abort();
  }));
  cp.on('error', mustNotCall());
  setTimeout(() => cp.kill(), 1);
}
