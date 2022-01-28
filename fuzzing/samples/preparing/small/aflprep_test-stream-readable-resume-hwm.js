'use strict';
const { Readable } = require('stream');
const readable = new Readable({
  read: common.mustNotCall(),
  highWaterMark: 100
});
for (let i = 0; i < 10; i++)
  readable.push('a'.repeat(200));
readable.resume();
readable.once('data', common.mustCall(() => readable.pause()));
