'use strict';
const assert = require('assert');
const zlib = require('zlib');
{
  const inflate = zlib.createInflate({ windowBits: 0 });
  assert(inflate instanceof zlib.Inflate);
}
{
  const gunzip = zlib.createGunzip({ windowBits: 0 });
  assert(gunzip instanceof zlib.Gunzip);
}
{
  const unzip = zlib.createUnzip({ windowBits: 0 });
  assert(unzip instanceof zlib.Unzip);
}
{
  assert.throws(() => zlib.createGzip({ windowBits: 0 }), {
    code: 'ERR_OUT_OF_RANGE',
    name: 'RangeError',
    message: 'The value of "options.windowBits" is out of range. ' +
             'It must be >= 9 and <= 15. Received 0'
  });
}
