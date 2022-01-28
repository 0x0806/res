'use strict';
const assert = require('assert');
const net = require('net');
function close() { this.close(); }
{
  net.createServer().listen().on('listening', common.mustCall(close));
  net.createServer().listen(common.mustCall(close));
  net.createServer().listen(0).on('listening', common.mustCall(close));
  net.createServer().listen({ port: 0 })
    .on('listening', common.mustCall(close));
}
const listenOnPort = [
  (port, cb) => net.createServer().listen({ port }, cb),
  (port, cb) => net.createServer().listen(port, cb),
];
{
  const assertPort = () => {
    return common.expectsError({
      code: 'ERR_SOCKET_BAD_PORT',
      name: 'RangeError'
    });
  };
  for (const listen of listenOnPort) {
    listen('0', common.mustCall(close));
    listen(0, common.mustCall(close));
    listen(undefined, common.mustCall(close));
    listen(null, common.mustCall(close));
    assert.throws(() => listen(-1, common.mustNotCall()), assertPort());
    assert.throws(() => listen(NaN, common.mustNotCall()), assertPort());
    assert.throws(() => listen(123.456, common.mustNotCall()), assertPort());
    assert.throws(() => listen(65536, common.mustNotCall()), assertPort());
  }
  assert.throws(() => {
    net.createServer().listen({ port: -1, path: common.PIPE },
                              common.mustNotCall());
  }, assertPort());
}
{
  function shouldFailToListen(options) {
    const fn = () => {
      net.createServer().listen(options, common.mustNotCall());
    };
    if (typeof options === 'object' &&
      !(('port' in options) || ('path' in options))) {
      assert.throws(fn,
                    {
                      code: 'ERR_INVALID_ARG_VALUE',
                      name: 'TypeError',
                    });
    } else {
      assert.throws(fn,
                    {
                      code: 'ERR_INVALID_ARG_VALUE',
                      name: 'TypeError',
                    });
    }
  }
  shouldFailToListen(false, { port: false });
  shouldFailToListen({ port: false });
  shouldFailToListen(true);
  shouldFailToListen({ port: true });
  shouldFailToListen({ fd: -1 });
  shouldFailToListen({ path: -1 });
  shouldFailToListen({});
  shouldFailToListen({ host: 'localhost' });
  shouldFailToListen({ host: 'localhost:3000' });
  shouldFailToListen({ host: { port: 3000 } });
  shouldFailToListen({ exclusive: true });
}
