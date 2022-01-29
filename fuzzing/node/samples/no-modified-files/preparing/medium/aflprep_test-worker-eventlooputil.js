'use strict';
const assert = require('assert');
const {
  Worker,
  MessageChannel,
  MessagePort,
  parentPort,
} = require('worker_threads');
const { eventLoopUtilization, now } = require('perf_hooks').performance;
if (process.argv[2] === 'iamalive') {
  const iaElu = idleActive(eventLoopUtilization());
  assert.ok(iaElu > 0, `${iaElu} <= 0`);
  parentPort.once('message', mustCall((msg) => {
    assert.ok(msg.metricsCh instanceof MessagePort);
    msg.metricsCh.on('message', mustCallAtLeast(workerOnMetricsMsg, 1));
  }));
  return;
}
function workerOnMetricsMsg(msg) {
  if (msg.cmd === 'close') {
    return this.close();
  }
  if (msg.cmd === 'elu') {
    return this.postMessage(eventLoopUtilization());
  }
  if (msg.cmd === 'spin') {
    const elu = eventLoopUtilization();
    const t = now();
    while (now() - t < msg.dur);
    return this.postMessage(eventLoopUtilization(elu));
  }
}
let worker;
let metricsCh;
let mainElu;
let workerELU;
(function r() {
  if (eventLoopUtilization().idle <= 0)
    return setTimeout(mustCall(r), 5);
  mainElu = eventLoopUtilization();
  worker = new Worker(__filename, { argv: [ 'iamalive' ] });
  metricsCh = new MessageChannel();
  worker.postMessage({ metricsCh: metricsCh.port1 }, [ metricsCh.port1 ]);
  workerELU = worker.performance.eventLoopUtilization;
  metricsCh.port2.once('message', mustCall(checkWorkerIdle));
  metricsCh.port2.postMessage({ cmd: 'elu' });
  worker.on('exit', mustCall(() => {
    assert.deepStrictEqual(worker.performance.eventLoopUtilization(),
                           { idle: 0, active: 0, utilization: 0 });
  }));
})();
function checkWorkerIdle(wElu) {
  const perfWorkerElu = workerELU();
  const tmpMainElu = eventLoopUtilization(mainElu);
  assert.ok(idleActive(wElu) > 0, `${idleActive(wElu)} <= 0`);
  assert.ok(idleActive(workerELU(wElu)) > 0,
            `${idleActive(workerELU(wElu))} <= 0`);
  assert.ok(idleActive(perfWorkerElu) > idleActive(wElu),
            `${idleActive(perfWorkerElu)} <= ${idleActive(wElu)}`);
  assert.ok(idleActive(tmpMainElu) > idleActive(perfWorkerElu),
            `${idleActive(tmpMainElu)} <= ${idleActive(perfWorkerElu)}`);
  wElu = workerELU();
  setTimeout(mustCall(() => {
    wElu = workerELU(wElu);
    assert.ok(idleActive(wElu) >= 45, `${idleActive(wElu)} < 45`);
    assert.ok(wElu.idle >= 25, `${wElu.idle} < 25`);
    checkWorkerActive();
  }), 50);
}
function checkWorkerActive() {
  const w = workerELU();
  metricsCh.port2.postMessage({ cmd: 'spin', dur: 50 });
  metricsCh.port2.once('message', (wElu) => {
    const w2 = workerELU(w);
    assert.ok(w2.active >= 50, `${w2.active} < 50`);
    assert.ok(wElu.active >= 50, `${wElu.active} < 50`);
    assert.ok(idleActive(wElu) < idleActive(w2),
              `${idleActive(wElu)} >= ${idleActive(w2)}`);
    metricsCh.port2.postMessage({ cmd: 'close' });
  });
}
function idleActive(elu) {
  return elu.idle + elu.active;
}
