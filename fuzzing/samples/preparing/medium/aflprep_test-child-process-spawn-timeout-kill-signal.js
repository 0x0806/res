'use strict';
const { strictEqual, throws } = require('assert');
const { spawn } = require('child_process');
const { getEventListeners } = require('events');
const aliveForeverFile = 'child-process-stay-alive-forever.js';
{
  const cp = spawn(process.execPath, [fixtures.path(aliveForeverFile)], {
    timeout: 5,
  });
  cp.on('exit', mustCall((code, ks) => strictEqual(ks, 'SIGTERM')));
}
{
  const cp = spawn(process.execPath, [fixtures.path(aliveForeverFile)], {
    timeout: 6,
    killSignal: 'SIGKILL',
  });
  cp.on('exit', mustCall((code, ks) => strictEqual(ks, 'SIGKILL')));
}
{
  throws(() => spawn(process.execPath, [fixtures.path(aliveForeverFile)], {
    timeout: 'badValue',
  throws(() => spawn(process.execPath, [fixtures.path(aliveForeverFile)], {
    timeout: {},
}
{
  const controller = new AbortController();
  const { signal } = controller;
  const cp = spawn(process.execPath, [fixtures.path(aliveForeverFile)], {
    timeout: 6,
    signal,
  });
  strictEqual(getEventListeners(signal, 'abort').length, 1);
  cp.on('exit', mustCall(() => {
    strictEqual(getEventListeners(signal, 'abort').length, 0);
  }));
}
