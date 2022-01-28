'use strict';
const zlib = require('zlib');
const data = zlib.deflateRawSync('Welcome');
const inflate = zlib.createInflateRaw();
inflate.resume();
inflate.write(data, common.mustCall());
inflate.write(Buffer.from([0x00]), common.mustCall());
inflate.write(Buffer.from([0x00]), common.mustCall());
inflate.flush(common.mustCall());
