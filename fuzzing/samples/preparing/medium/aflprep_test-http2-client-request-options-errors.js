'use strict';
if (!common.hasCrypto)
  common.skip('missing crypto');
const assert = require('assert');
const http2 = require('http2');
const { inspect } = require('util');
const optionsToTest = {
  endStream: 'boolean',
  weight: 'number',
  parent: 'number',
  exclusive: 'boolean',
  silent: 'boolean'
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
const server = http2.createServer(common.mustNotCall());
server.listen(0, common.mustCall(() => {
  const port = server.address().port;
  client.on('connect', () => {
    Object.keys(optionsToTest).forEach((option) => {
      Object.keys(types).forEach((type) => {
        if (type === optionsToTest[option])
          return;
        assert.throws(
          () => client.request({
            ':method': 'CONNECT',
            ':authority': `localhost:${port}`
          }, {
            [option]: types[type]
          }), {
            name: 'TypeError',
            code: 'ERR_INVALID_ARG_VALUE',
            message: `The property 'options.${option}' is invalid. ` +
                    `Received ${inspect(types[type])}`
          });
      });
    });
    server.close();
    client.close();
  });
}));
