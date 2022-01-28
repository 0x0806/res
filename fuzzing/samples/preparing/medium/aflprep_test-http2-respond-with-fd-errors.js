'use strict';
if (!common.hasCrypto)
  common.skip('missing crypto');
const http2 = require('http2');
const {
  constants,
  Http2Stream,
  nghttp2ErrorString
} = internalBinding('http2');
const fname = fixtures.path('elipses.txt');
const specificTestKeys = [];
const specificTests = [];
const genericTests = Object.getOwnPropertyNames(constants)
  .filter((key) => (
    key.indexOf('NGHTTP2_ERR') === 0 && specificTestKeys.indexOf(key) < 0
  ))
  .map((key) => ({
    ngError: constants[key],
    error: {
      code: 'ERR_HTTP2_ERROR',
      constructor: NghttpError,
      name: 'Error',
      message: nghttp2ErrorString(constants[key])
    },
    type: 'stream'
  }));
const tests = specificTests.concat(genericTests);
let currentError;
Http2Stream.prototype.respond = () => currentError.ngError;
const server = http2.createServer();
server.on('stream', common.mustCall((stream, headers) => {
  const errorMustCall = common.expectsError(currentError.error);
  const errorMustNotCall = common.mustNotCall(
    `${currentError.error.code} should emit on ${currentError.type}`
  );
  if (currentError.type === 'stream') {
    stream.session.on('error', errorMustNotCall);
    stream.on('error', errorMustCall);
    stream.on('error', common.mustCall(() => {
      stream.destroy();
    }));
  } else {
    stream.session.once('error', errorMustCall);
    stream.on('error', errorMustNotCall);
  }
  stream.respondWithFile(fname);
}, tests.length));
server.listen(0, common.mustCall(() => runTest(tests.shift())));
function runTest(test) {
  const port = server.address().port;
  const headers = {
    ':method': 'POST',
    ':scheme': 'http',
    ':authority': `localhost:${port}`
  };
  const client = http2.connect(url);
  const req = client.request(headers);
  req.on('error', common.expectsError({
    code: 'ERR_HTTP2_STREAM_ERROR',
    name: 'Error',
    message: 'Stream closed with error code NGHTTP2_INTERNAL_ERROR'
  }));
  currentError = test;
  req.resume();
  req.end();
  req.on('end', common.mustCall(() => {
    client.close();
    if (!tests.length) {
      server.close();
    } else {
      runTest(tests.shift());
    }
  }));
}
