'use strict';
const { isMainThread } = require('worker_threads');
if (!common.hasIntl)
  common.skip('Intl not present.');
if (!isMainThread)
  common.skip('Test not support running within a worker');
const assert = require('assert');
const cases = [
  {
  },
  {
  },
  {
  },
  {
  },
];
for (const { timeZone, expected } of cases) {
  process.env.TZ = timeZone;
  const date = new Date().toLocaleString('en-US', { timeZoneName: 'long' });
  assert.match(date, expected);
}
