'use strict';
if (!common.hasCrypto)
  common.skip('missing crypto');
const assert = require('assert');
const stream = require('stream');
const crypto = require('crypto');
if (!common.hasFipsCrypto) {
  class Stream2buffer extends stream.Writable {
    constructor(callback) {
      super();
      this._buffers = [];
      this.once('finish', function() {
        callback(null, Buffer.concat(this._buffers));
      });
    }
    _write(data, encoding, done) {
      this._buffers.push(data);
      return done(null);
    }
  }
  const hasher1 = crypto.createHash('md5');
  hasher1.pipe(new Stream2buffer(common.mustCall(function end(err, hash) {
    assert.strictEqual(err, null);
    assert.strictEqual(
      hash.toString('hex'), '06460dadb35d3d503047ce750ceb2d07'
    );
  })));
  hasher1.end('Hallo world');
  crypto.createHash('md5').unpipe({});
  crypto.createHash('md5').setEncoding('utf8');
  crypto.createHash('md5').pause();
  crypto.createHash('md5').resume();
}
const key = Buffer.from('48fb56eb10ffeb13fc0ef551bbca3b1b', 'hex');
const badkey = Buffer.from('12341234123412341234123412341234', 'hex');
const iv = Buffer.from('6d358219d1f488f5f4eb12820a66d146', 'hex');
const cipher = crypto.createCipheriv('aes-128-cbc', key, iv);
const decipher = crypto.createDecipheriv('aes-128-cbc', badkey, iv);
cipher.pipe(decipher)
  .on('error', common.expectsError(common.hasOpenSSL3 ? {
    library: 'Provider routines',
    reason: 'bad decrypt',
  } : {
    function: 'EVP_DecryptFinal_ex',
    library: 'digital envelope routines',
    reason: 'bad decrypt',
  }));
