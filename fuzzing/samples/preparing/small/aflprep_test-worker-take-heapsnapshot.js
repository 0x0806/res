'use strict';
const { Worker } = require('worker_threads');
const { once } = require('events');
(async function() {
  const w = new Worker('setInterval(() => {}, 100)', { eval: true });
  await once(w, 'online');
  const stream = await w.getHeapSnapshot();
  const snapshot = recordState(stream);
    {
      children: [
      ]
    },
  ], { loose: true });
  await w.terminate();
})().then(common.mustCall());
