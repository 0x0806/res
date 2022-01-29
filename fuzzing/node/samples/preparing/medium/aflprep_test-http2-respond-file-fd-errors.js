'use strict';
if (!common.hasCrypto)
  common.skip('missing crypto');
const assert = require('assert');
const http2 = require('http2');
const fs = require('fs');
const { inspect } = require('util');
const optionsWithTypeError = {
  offset: 'number',
  length: 'number',
  statCheck: 'function'
};
const types = {
  boolean: true,
  function: () => {},
  number: 1,
  object: {},
  array: [],
  null: null,
  symbol: Symbol('test')
};
const fname = fixtures.path('elipses.txt');
const fd = fs.openSync(fname, 'r');
const server = http2.createServer();
server.on('stream', common.mustCall((stream) => {
  Object.keys(types).forEach((type) => {
    if (type === 'number') {
      return;
    }
    assert.throws(
      () => stream.respondWithFD(types[type], {
      }),
      {
        name: 'TypeError',
        code: 'ERR_INVALID_ARG_TYPE',
        message: 'The "fd" argument must be of type number or an instance of' +
                 ` FileHandle.${common.invalidArgTypeHelper(types[type])}`
      }
    );
  });
  Object.keys(optionsWithTypeError).forEach((option) => {
    Object.keys(types).forEach((type) => {
      if (type === optionsWithTypeError[option]) {
        return;
      }
      assert.throws(
        () => stream.respondWithFD(fd, {
        }, {
          [option]: types[type]
        }),
        {
          name: 'TypeError',
          code: 'ERR_INVALID_ARG_VALUE',
          message: `The property 'options.${option}' is invalid. ` +
            `Received ${inspect(types[type])}`
        }
      );
    });
  });
  [204, 205, 304].forEach((status) => assert.throws(
    () => stream.respondWithFD(fd, {
      ':status': status,
    }),
    {
      code: 'ERR_HTTP2_PAYLOAD_FORBIDDEN',
      name: 'Error',
      message: `Responses with ${status} status must not have a payload`
    }
  ));
  stream.respond();
  assert.throws(
    () => stream.respondWithFD(fd, {
    }),
    {
      code: 'ERR_HTTP2_HEADERS_SENT',
      name: 'Error',
      message: 'Response has already been initiated.'
    }
  );
  stream.destroy();
  assert.throws(
    () => stream.respondWithFD(fd, {
    }),
    {
      code: 'ERR_HTTP2_INVALID_STREAM',
      name: 'Error',
      message: 'The stream has been destroyed'
    }
  );
}));
server.listen(0, common.mustCall(() => {
  const req = client.request();
  req.on('close', common.mustCall(() => {
    client.close();
    server.close();
  }));
  req.end();
}));
