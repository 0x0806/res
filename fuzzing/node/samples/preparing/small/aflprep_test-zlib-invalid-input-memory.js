'use strict';
const assert = require('assert');
const zlib = require('zlib');
const ongc = common.mustCall();
{
  const input = Buffer.from('foobar');
  const strm = zlib.createInflate();
  strm.end(input);
  strm.once('error', common.mustCall((err) => {
    assert(err);
    setImmediate(() => {
      global.gc();
      setImmediate(() => {});
    });
  }));
  onGC(strm, { ongc });
}
