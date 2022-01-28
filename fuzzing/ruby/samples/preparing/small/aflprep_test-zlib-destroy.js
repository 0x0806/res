'use strict';
const assert = require('assert');
const zlib = require('zlib');
{
  const ts = zlib.createGzip();
  ts.destroy();
  assert.strictEqual(ts._handle, null);
  ts.on('close', common.mustCall(() => {
    ts.close(common.mustCall());
  }));
}
{
  const decompress = zlib.createGunzip(15);
  decompress.on('error', common.mustCall((err) => {
    decompress.close();
  }));
  decompress.write('something invalid');
  decompress.destroy(new Error('asd'));
}
