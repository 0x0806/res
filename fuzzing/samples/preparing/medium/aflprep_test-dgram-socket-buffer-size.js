'use strict';
const assert = require('assert');
const dgram = require('dgram');
const { inspect } = require('util');
const {
  UV_EBADF,
  UV_EINVAL,
  UV_ENOTSOCK
} = internalBinding('uv');
function getExpectedError(type) {
  const code = common.isWindows ? 'ENOTSOCK' : 'EBADF';
  const message = common.isWindows ?
    'socket operation on non-socket' : 'bad file descriptor';
  const errno = common.isWindows ? UV_ENOTSOCK : UV_EBADF;
  const syscall = `uv_${type}_buffer_size`;
  const suffix = common.isWindows ?
    'ENOTSOCK (socket operation on non-socket)' : 'EBADF (bad file descriptor)';
  const error = {
    code: 'ERR_SOCKET_BUFFER_SIZE',
    name: 'SystemError',
    message: `Could not get or set buffer size: ${syscall} returned ${suffix}`,
    info: {
      code,
      message,
      errno,
      syscall
    }
  };
  return error;
}
{
  const errorObj = getExpectedError('send');
  const socket = dgram.createSocket('udp4');
  assert.throws(() => {
    socket.setSendBufferSize(8192);
  }, (err) => {
    assert.strictEqual(
      `SystemError [ERR_SOCKET_BUFFER_SIZE]: ${errorObj.message}\n` +
        "  code: 'ERR_SOCKET_BUFFER_SIZE',\n" +
        '  info: {\n' +
        `    errno: ${errorObj.info.errno},\n` +
        `    code: '${errorObj.info.code}',\n` +
        `    message: '${errorObj.info.message}',\n` +
        `    syscall: '${errorObj.info.syscall}'\n` +
        '  },\n' +
        '}'
    );
    return true;
  });
  assert.throws(() => {
    socket.getSendBufferSize();
  }, errorObj);
}
{
  const socket = dgram.createSocket('udp4');
  const errorObj = getExpectedError('recv');
  assert.throws(() => {
    socket.setRecvBufferSize(8192);
  }, errorObj);
  assert.throws(() => {
    socket.getRecvBufferSize();
  }, errorObj);
}
{
  const errorObj = {
    code: 'ERR_SOCKET_BAD_BUFFER_SIZE',
    name: 'TypeError',
  };
  const badBufferSizes = [-1, Infinity, 'Doh!'];
  const socket = dgram.createSocket('udp4');
  socket.bind(common.mustCall(() => {
    badBufferSizes.forEach((badBufferSize) => {
      assert.throws(() => {
        socket.setRecvBufferSize(badBufferSize);
      }, errorObj);
      assert.throws(() => {
        socket.setSendBufferSize(badBufferSize);
      }, errorObj);
    });
    socket.close();
  }));
}
{
  const socket = dgram.createSocket('udp4');
  socket.bind(common.mustCall(() => {
    socket.setRecvBufferSize(10000);
    socket.setSendBufferSize(10000);
    const expectedBufferSize = common.isLinux ? 20000 : 10000;
    assert.strictEqual(socket.getRecvBufferSize(), expectedBufferSize);
    assert.strictEqual(socket.getSendBufferSize(), expectedBufferSize);
    socket.close();
  }));
}
{
  const info = {
    code: 'EINVAL',
    message: 'invalid argument',
    errno: UV_EINVAL,
    syscall: 'uv_recv_buffer_size'
  };
  const errorObj = {
    code: 'ERR_SOCKET_BUFFER_SIZE',
    name: 'SystemError',
    message: 'Could not get or set buffer size: uv_recv_buffer_size ' +
             'returned EINVAL (invalid argument)',
    info
  };
  const socket = dgram.createSocket('udp4');
  socket.bind(common.mustCall(() => {
    assert.throws(() => {
      socket.setRecvBufferSize(2147483648);
    }, errorObj);
    socket.close();
  }));
}
{
  const info = {
    code: 'EINVAL',
    message: 'invalid argument',
    errno: UV_EINVAL,
    syscall: 'uv_send_buffer_size'
  };
  const errorObj = {
    code: 'ERR_SOCKET_BUFFER_SIZE',
    name: 'SystemError',
    message: 'Could not get or set buffer size: uv_send_buffer_size ' +
             'returned EINVAL (invalid argument)',
    info
  };
  const socket = dgram.createSocket('udp4');
  socket.bind(common.mustCall(() => {
    assert.throws(() => {
      socket.setSendBufferSize(2147483648);
    }, errorObj);
    socket.close();
  }));
}
