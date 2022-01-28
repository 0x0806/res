'use strict';
const zlib = require('zlib');
zlib.gzip('hello', common.mustCall(function(err, out) {
  const unzip = zlib.createGunzip();
  unzip.close(common.mustCall());
  unzip.write('asd', common.expectsError({
    code: 'ERR_STREAM_DESTROYED',
    name: 'Error',
    message: 'Cannot call write after a stream was destroyed'
  }));
}));
