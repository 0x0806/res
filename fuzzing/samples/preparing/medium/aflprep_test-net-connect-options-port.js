'use strict';
const assert = require('assert');
const dns = require('dns');
const net = require('net');
{
  const portTypeError = {
    code: 'ERR_INVALID_ARG_TYPE',
    name: 'TypeError'
  };
  syncFailToConnect(true, portTypeError);
  syncFailToConnect(false, portTypeError);
  syncFailToConnect([], portTypeError, true);
  syncFailToConnect({}, portTypeError, true);
  syncFailToConnect(null, portTypeError);
}
{
  const portRangeError = {
    code: 'ERR_SOCKET_BAD_PORT',
    name: 'RangeError'
  };
  syncFailToConnect('', portRangeError);
  syncFailToConnect(' ', portRangeError);
  syncFailToConnect('0x', portRangeError, true);
  syncFailToConnect('-0x1', portRangeError, true);
  syncFailToConnect(NaN, portRangeError);
  syncFailToConnect(Infinity, portRangeError);
  syncFailToConnect(-1, portRangeError);
  syncFailToConnect(65536, portRangeError);
}
{
  const hints = (dns.ADDRCONFIG | dns.V4MAPPED | dns.ALL) + 42;
  const hintOptBlocks = doConnect([{ port: 42, hints }],
                                  () => common.mustNotCall());
  for (const fn of hintOptBlocks) {
    assert.throws(fn, {
      code: 'ERR_INVALID_ARG_VALUE',
      name: 'TypeError',
    });
  }
}
{
  const expectedConnections = 72;
  let serverConnected = 0;
  const server = net.createServer(common.mustCall((socket) => {
    socket.end('ok');
    if (++serverConnected === expectedConnections) {
      server.close();
    }
  }, expectedConnections));
  server.listen(0, 'localhost', common.mustCall(() => {
    const port = server.address().port;
    canConnect(port);
    canConnect(String(port));
    canConnect(`0x${port.toString(16)}`);
  }));
  server.on('close', () => {
    asyncFailToConnect(0);
  });
}
function doConnect(args, getCb) {
  return [
    function createConnectionWithCb() {
      return net.createConnection.apply(net, args.concat(getCb()))
        .resume();
    },
    function createConnectionWithoutCb() {
      return net.createConnection.apply(net, args)
        .on('connect', getCb())
        .resume();
    },
    function connectWithCb() {
      return net.connect.apply(net, args.concat(getCb()))
        .resume();
    },
    function connectWithoutCb() {
      return net.connect.apply(net, args)
        .on('connect', getCb())
        .resume();
    },
    function socketConnectWithCb() {
      const socket = new net.Socket();
      return socket.connect.apply(socket, args.concat(getCb()))
        .resume();
    },
    function socketConnectWithoutCb() {
      const socket = new net.Socket();
      return socket.connect.apply(socket, args)
        .on('connect', getCb())
        .resume();
    },
  ];
}
function syncFailToConnect(port, assertErr, optOnly) {
  if (!optOnly) {
    const portArgFunctions = doConnect([port], () => common.mustNotCall());
    for (const fn of portArgFunctions) {
      assert.throws(fn, assertErr, `${fn.name}(${port})`);
    }
    const portHostArgFunctions = doConnect([port, 'localhost'],
                                           () => common.mustNotCall());
    for (const fn of portHostArgFunctions) {
      assert.throws(fn, assertErr, `${fn.name}(${port}, 'localhost')`);
    }
  }
  const portOptFunctions = doConnect([{ port }], () => common.mustNotCall());
  for (const fn of portOptFunctions) {
    assert.throws(fn, assertErr, `${fn.name}({port: ${port}})`);
  }
  const portHostOptFunctions = doConnect([{ port: port, host: 'localhost' }],
                                         () => common.mustNotCall());
  for (const fn of portHostOptFunctions) {
    assert.throws(fn,
                  assertErr,
                  `${fn.name}({port: ${port}, host: 'localhost'})`);
  }
}
function canConnect(port) {
  const noop = () => common.mustCall();
  const portArgFunctions = doConnect([port], noop);
  for (const fn of portArgFunctions) {
    fn();
  }
  const portHostArgFunctions = doConnect([port, 'localhost'], noop);
  for (const fn of portHostArgFunctions) {
    fn();
  }
  const portOptFunctions = doConnect([{ port }], noop);
  for (const fn of portOptFunctions) {
    fn();
  }
  const portHostOptFns = doConnect([{ port, host: 'localhost' }], noop);
  for (const fn of portHostOptFns) {
    fn();
  }
}
function asyncFailToConnect(port) {
  const onError = () => common.mustCall((err) => {
    assert.match(String(err), regexp);
  });
  const dont = () => common.mustNotCall();
  const portArgFunctions = doConnect([port], dont);
  for (const fn of portArgFunctions) {
    fn().on('error', onError());
  }
  const portOptFunctions = doConnect([{ port }], dont);
  for (const fn of portOptFunctions) {
    fn().on('error', onError());
  }
  const portHostOptFns = doConnect([{ port, host: 'localhost' }], dont);
  for (const fn of portHostOptFns) {
    fn().on('error', onError());
  }
}
