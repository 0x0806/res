'use strict';
if (!common.hasCrypto)
  common.skip('missing crypto');
const assert = require('assert');
const http2 = require('http2');
const server = http2.createServer();
server.on('stream', common.mustCall((stream) => {
  stream.session.altsvc('h2=":8000"', stream.id);
  stream.respond();
  stream.end('ok');
}));
server.on('session', common.mustCall((session) => {
  session.altsvc('h2=":8000"', 3);
  [0, -1, 1.1, 0xFFFFFFFF + 1, Infinity, -Infinity].forEach((input) => {
    assert.throws(
      () => session.altsvc('h2=":8000"', input),
      {
        code: 'ERR_OUT_OF_RANGE',
        name: 'RangeError',
        message: 'The value of "originOrStream" is out of ' +
                 `range. It must be > 0 && < 4294967296. Received ${input}`
      }
    );
  });
  [0, {}, [], null, Infinity].forEach((input) => {
    assert.throws(
      () => session.altsvc(input),
      {
        code: 'ERR_INVALID_ARG_TYPE',
        name: 'TypeError'
      }
    );
  });
  ['\u0001', 'h2="\uff20"', '👀'].forEach((input) => {
    assert.throws(
      () => session.altsvc(input),
      {
        code: 'ERR_INVALID_CHAR',
        name: 'TypeError',
        message: 'Invalid character in alt'
      }
    );
  });
  [{}, [], true].forEach((input) => {
    assert.throws(
      () => session.altsvc('clear', input),
      {
        code: 'ERR_INVALID_ARG_TYPE',
        name: 'TypeError'
      }
    );
  });
  [
    'abc:',
    new URL('abc:'),
    { origin: 'null' },
    { origin: '' },
  ].forEach((input) => {
    assert.throws(
      () => session.altsvc('h2=":8000', input),
      {
        code: 'ERR_HTTP2_ALTSVC_INVALID_ORIGIN',
        name: 'TypeError',
      }
    );
  });
  assert.throws(
    () => {
      session.altsvc('h2=":8000"',
    },
    {
      code: 'ERR_HTTP2_ALTSVC_LENGTH',
      name: 'TypeError',
    }
  );
}));
server.listen(0, common.mustCall(() => {
  const countdown = new Countdown(4, () => {
    client.close();
    server.close();
  });
  client.on('altsvc', common.mustCall((alt, origin, stream) => {
    assert.strictEqual(alt, 'h2=":8000"');
    switch (stream) {
      case 0:
        break;
      case 1:
        assert.strictEqual(origin, '');
        break;
      default:
        assert.fail('should not happen');
    }
    countdown.dec();
  }, 4));
  const req = client.request();
  req.resume();
  req.on('close', common.mustCall());
}));
