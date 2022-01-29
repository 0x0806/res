'use strict';
const { Worker } = require('worker_threads');
const worker = new Worker('setInterval(() => {}, 100);', { eval: true });
  {
    children: [
      { node_name: 'Worker', edge_name: 'wrapped' },
    ]
  },
]);
  {
    children: [
    ]
  },
], { loose: true });
worker.terminate();
