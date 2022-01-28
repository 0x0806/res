'use strict';
if (process.config.variables.asan) {
  common.skip('ASAN messes with memory measurements');
}
const assert = require('assert');
const vm = require('vm');
const baselineRss = process.memoryUsage.rss();
const start = Date.now();
const interval = setInterval(function() {
  try {
    vm.runInNewContext('throw 1;');
  } catch {
  }
  global.gc();
  const rss = process.memoryUsage.rss();
  assert.ok(rss < baselineRss + 32 * 1024 * 1024,
            `memory usage: ${rss} baseline: ${baselineRss}`);
  if (Date.now() - start > 5 * 1000) {
    clearInterval(interval);
    testContextLeak();
  }
}, 1);
function testContextLeak() {
  for (let i = 0; i < 1000; i++)
    vm.createContext({});
}
