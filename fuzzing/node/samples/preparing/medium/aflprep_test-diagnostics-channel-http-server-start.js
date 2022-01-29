'use strict';
const { AsyncLocalStorage } = require('async_hooks');
const dc = require('diagnostics_channel');
const assert = require('assert');
const http = require('http');
const incomingStartChannel = dc.channel('http.server.request.start');
const outgoingFinishChannel = dc.channel('http.server.response.finish');
const als = new AsyncLocalStorage();
let context;
incomingStartChannel.subscribe(common.mustCall((message) => {
  als.enterWith(message);
  context = message;
}));
outgoingFinishChannel.subscribe(common.mustCall((message) => {
  const data = {
    request,
    response,
    server,
    socket: request.socket
  };
  compare(als.getStore(), context);
  compare(context, data);
  compare(message, data);
}));
let request;
let response;
const server = http.createServer(common.mustCall((req, res) => {
  request = req;
  response = res;
  setTimeout(() => {
    res.end('done');
  }, 1);
}));
server.listen(() => {
  const { port } = server.address();
    res.resume();
    res.on('end', () => {
      server.close();
    });
  });
});
function compare(a, b) {
  assert.strictEqual(a.request, b.request);
  assert.strictEqual(a.response, b.response);
  assert.strictEqual(a.socket, b.socket);
  assert.strictEqual(a.server, b.server);
}
