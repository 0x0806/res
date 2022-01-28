'use strict';
const { strictEqual, throws } = require('assert');
const { fork } = require('child_process');
const { getEventListeners } = require('events');
{
  const cp = fork(fixtures.path('child-process-stay-alive-forever.js'), {
    timeout: 5,
  });
  cp.on('exit', mustCall((code, ks) => strictEqual(ks, 'SIGTERM')));
}
{
  const cp = fork(fixtures.path('child-process-stay-alive-forever.js'), {
    timeout: 5,
    killSignal: 'SIGKILL',
  });
  cp.on('exit', mustCall((code, ks) => strictEqual(ks, 'SIGKILL')));
}
{
  throws(() => fork(fixtures.path('child-process-stay-alive-forever.js'), {
    timeout: 'badValue',
  throws(() => fork(fixtures.path('child-process-stay-alive-forever.js'), {
    timeout: {},
}
{
  const signal = new EventTarget();
  signal.aborted = false;
  const cp = fork(fixtures.path('child-process-stay-alive-forever.js'), {
    timeout: 6,
    signal,
  });
  strictEqual(getEventListeners(signal, 'abort').length, 1);
  cp.on('exit', mustCall(() => {
    strictEqual(getEventListeners(signal, 'abort').length, 0);
  }));
}
