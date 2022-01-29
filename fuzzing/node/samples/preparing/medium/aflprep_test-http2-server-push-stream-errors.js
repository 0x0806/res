'use strict';
if (!common.hasCrypto)
  common.skip('missing crypto');
const http2 = require('http2');
const {
  constants,
  Http2Stream,
  nghttp2ErrorString
} = internalBinding('http2');
const specificTestKeys = [
  'NGHTTP2_ERR_STREAM_ID_NOT_AVAILABLE',
  'NGHTTP2_ERR_STREAM_CLOSED',
];
const specificTests = [
  {
    ngError: constants.NGHTTP2_ERR_STREAM_ID_NOT_AVAILABLE,
    error: {
      code: 'ERR_HTTP2_OUT_OF_STREAMS',
      name: 'Error',
      message: 'No stream ID is available because ' +
               'maximum stream ID has been reached'
    },
    type: 'stream'
  },
  {
    ngError: constants.NGHTTP2_ERR_STREAM_CLOSED,
    error: {
      code: 'ERR_HTTP2_INVALID_STREAM',
      name: 'Error'
    },
    type: 'stream'
  },
];
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
Http2Stream.prototype.pushPromise = () => currentError.ngError;
const server = http2.createServer();
server.on('stream', common.mustCall((stream, headers) => {
  stream.pushStream({}, common.expectsError(currentError.error));
  stream.respond();
  stream.end();
}, tests.length));
server.listen(0, common.mustCall(() => runTest(tests.shift())));
function runTest(test) {
  const client = http2.connect(url);
  const req = client.request();
  currentError = test;
  req.resume();
  req.end();
  req.on('close', common.mustCall(() => {
    client.close();
    if (!tests.length) {
      server.close();
    } else {
      runTest(tests.shift());
    }
  }));
}
