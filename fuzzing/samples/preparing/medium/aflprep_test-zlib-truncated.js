'use strict';
const assert = require('assert');
const zlib = require('zlib');
const inputString = 'ΩΩLorem ipsum dolor sit amet, consectetur adipiscing eli' +
                    't. Morbi faucibus, purus at gravida dictum, libero arcu ' +
                    'convallis lacus, in commodo libero metus eu nisi. Nullam' +
                    ' commodo, neque nec porta placerat, nisi est fermentum a' +
                    'ugue, vitae gravida tellus sapien sit amet tellus. Aenea' +
                    'n non diam orci. Proin quis elit turpis. Suspendisse non' +
                    ' diam ipsum. Suspendisse nec ullamcorper odio. Vestibulu' +
                    'm arcu mi, sodales non suscipit id, ultrices ut massa. S' +
                    'ed ac sem sit amet arcu malesuada fermentum. Nunc sed. ';
[
  { comp: 'gzip', decomp: 'gunzip', decompSync: 'gunzipSync' },
  { comp: 'gzip', decomp: 'unzip', decompSync: 'unzipSync' },
  { comp: 'deflate', decomp: 'inflate', decompSync: 'inflateSync' },
  { comp: 'deflateRaw', decomp: 'inflateRaw', decompSync: 'inflateRawSync' },
].forEach(function(methods) {
  zlib[methods.comp](inputString, function(err, compressed) {
    assert.ifError(err);
    const toUTF8 = (buffer) => buffer.toString('utf-8');
    const decompressed = zlib[methods.decompSync](compressed);
    assert.strictEqual(toUTF8(decompressed), inputString);
    zlib[methods.decomp](compressed, function(err, result) {
      assert.ifError(err);
      assert.strictEqual(toUTF8(result), inputString);
    });
    assert.throws(function() {
      zlib[methods.decompSync](truncated);
    }, errMessage);
    zlib[methods.decomp](truncated, function(err, result) {
      assert.match(err.message, errMessage);
    });
    const syncFlushOpt = { finishFlush: zlib.constants.Z_SYNC_FLUSH };
    const result = toUTF8(zlib[methods.decompSync](truncated, syncFlushOpt));
    assert.strictEqual(result, inputString.substr(0, result.length));
    zlib[methods.decomp](truncated, syncFlushOpt, function(err, decompressed) {
      assert.ifError(err);
      const result = toUTF8(decompressed);
      assert.strictEqual(result, inputString.substr(0, result.length));
    });
  });
});
