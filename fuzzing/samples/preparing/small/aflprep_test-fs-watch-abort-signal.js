'use strict';
if (common.isIBMi)
  common.skip('IBMi does not support `fs.watch()`');
const fs = require('fs');
{
  const file = fixtures.path('empty.js');
  const ac = new AbortController();
  const { signal } = ac;
  const watcher = fs.watch(file, { signal });
  watcher.once('close', common.mustCall());
  setImmediate(() => ac.abort());
}
{
  const file = fixtures.path('empty.js');
  const signal = AbortSignal.abort();
  const watcher = fs.watch(file, { signal });
  watcher.once('close', common.mustCall());
}
