'use strict';
const { Worker } = require('worker_threads');
const modules = [ 'fs', 'assert', 'async_hooks', 'buffer', 'child_process',
                  'net', 'http', 'os', 'path', 'v8', 'vm',
];
if (common.hasCrypto) {
  modules.push('https');
}
for (let i = 0; i < 10; i++) {
  new Worker(`const modules = [${modules.map((m) => `'${m}'`)}];` +
    'modules.forEach((module) => {' +
    'const m = require(module);' +
    '});', { eval: true });
}
setTimeout(() => {
  process.exit(0);
}, 200);
