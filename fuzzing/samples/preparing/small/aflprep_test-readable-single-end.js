'use strict';
const { Readable } = require('stream');
const r = new Readable({
  read: () => {},
});
r.push(null);
r.on('readable', common.mustCall());
r.on('end', common.mustCall());
