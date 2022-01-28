'use strict';
const { Readable } = require('stream');
{
  const r = new Readable();
  r.on('end', common.mustNotCall());
  r.resume();
  r.destroy();
  r.on('close', common.mustCall(() => {
    r.push(null);
  }));
}
