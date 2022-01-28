'use strict';
const zlib = require('zlib');
zlib.gzip('hello', common.mustCall((err, out) => {
  const unzip = zlib.createGunzip();
  unzip.write(out);
  unzip.close(common.mustCall());
}));
