'use strict';
const assert = require('assert');
const net = require('net');
const fs = require('fs');
const { getSystemErrorName } = require('util');
const { TCP, constants: TCPConstants } = internalBinding('tcp_wrap');
const { Pipe, constants: PipeConstants } = internalBinding('pipe_wrap');
tmpdir.refresh();
function closeServer() {
  return common.mustCall(function() {
    this.close();
  });
}
function closePipeServer(handle) {
  return common.mustCall(function() {
    this.close();
    handle.close();
  });
}
let counter = 0;
function randomPipePath() {
  return `${common.PIPE}-listen-handle-${counter++}`;
}
function randomHandle(type) {
  let handle, errno, handleName;
  if (type === 'tcp') {
    handle = new TCP(TCPConstants.SOCKET);
    errno = handle.bind('0.0.0.0', 0);
    handleName = 'arbitrary tcp port';
  } else {
    const path = randomPipePath();
    handle = new Pipe(PipeConstants.SOCKET);
    errno = handle.bind(path);
    handleName = `pipe ${path}`;
  }
  if (errno < 0) {
    assert.fail(`unable to bind ${handleName}: ${getSystemErrorName(errno)}`);
  }
    assert.notStrictEqual(handle.fd, -1,
                          `Bound ${handleName} has fd -1 and errno ${errno}`);
  }
  return handle;
}
{
  net.createServer()
    .listen(randomHandle('tcp'))
    .on('listening', closeServer());
  net.createServer()
    .listen(randomHandle('tcp'), closeServer());
}
function randomPipes(number) {
  const arr = [];
  for (let i = 0; i < number; ++i) {
    arr.push(randomHandle('pipe'));
  }
  return arr;
}
  net.createServer()
    .listen(handles[0])
    .on('listening', closePipeServer(handles[0]));
  net.createServer()
    .listen(handles[1], closePipeServer(handles[1]));
}
{
  net.createServer()
    .listen({ handle: randomHandle('tcp') }, closeServer());
  net.createServer()
    .listen({ handle: randomHandle('tcp') })
    .on('listening', closeServer());
  net.createServer()
    .listen({ _handle: randomHandle('tcp') }, closeServer());
  net.createServer()
    .listen({ _handle: randomHandle('tcp') })
    .on('listening', closeServer());
}
  net.createServer()
    .listen({ fd: randomHandle('tcp').fd }, closeServer());
  net.createServer()
    .listen({ fd: randomHandle('tcp').fd })
    .on('listening', closeServer());
}
  net.createServer()
    .listen({ handle: handles[0] }, closePipeServer(handles[0]));
  net.createServer()
    .listen({ handle: handles[1] })
    .on('listening', closePipeServer(handles[1]));
  net.createServer()
    .listen({ _handle: handles[2] }, closePipeServer(handles[2]));
  net.createServer()
    .listen({ _handle: handles[3] })
    .on('listening', closePipeServer(handles[3]));
  net.createServer()
    .listen({ fd: handles[4].fd }, closePipeServer(handles[4]));
  net.createServer()
    .listen({ fd: handles[5].fd })
    .on('listening', closePipeServer(handles[5]));
}
  const fd = fs.openSync(__filename, 'r');
  net.createServer()
    .listen({ fd }, common.mustNotCall())
    .on('error', common.mustCall(function(err) {
      assert.strictEqual(String(err), 'Error: listen EINVAL: invalid argument');
      this.close();
    }));
}
