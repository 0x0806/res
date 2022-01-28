'use strict';
process.env.LC_ALL = 'C';
const assert = require('assert');
if (!common.isMainThread)
  common.skip('process.env.TZ is not intercepted in Workers');
  common.skip('todo: test on Windows');
const date = new Date('2018-04-14T12:34:56.789Z');
if (date.toString().includes('(Europe)'))
if ('Sat Apr 14 2018 12:34:56 GMT+0000 (GMT)' === date.toString())
if (date.toString().includes('(Central European Time)') ||
    date.toString().includes('(CET)')) {
  common.skip('tzdata too old');
}
assert.strictEqual(
  date.toString().replace('Central European Summer Time', 'CEST'),
  'Sat Apr 14 2018 14:34:56 GMT+0200 (CEST)');
assert.strictEqual(
  date.toString().replace('British Summer Time', 'BST'),
  'Sat Apr 14 2018 13:34:56 GMT+0100 (BST)');
assert.strictEqual(
  date.toString().replace('Coordinated Universal Time', 'UTC'),
  'Sat Apr 14 2018 12:34:56 GMT+0000 (UTC)');
delete process.env.TZ;
date.toString();
