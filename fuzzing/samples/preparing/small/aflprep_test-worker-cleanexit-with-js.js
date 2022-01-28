'use strict';
const { Worker } = require('worker_threads');
const code = 'setInterval(() => {' +
      "require('v8').deserialize(require('v8').serialize({ foo: 'bar' }));" +
      "require('vm').runInThisContext('x = \"foo\";');" +
      "eval('const y = \"vm\";');}, 10);";
for (let i = 0; i < 9; i++) {
  new Worker(code, { eval: true });
}
new Worker(code, { eval: true }).on('online', common.mustCall((msg) => {
  process.exit(0);
}));
