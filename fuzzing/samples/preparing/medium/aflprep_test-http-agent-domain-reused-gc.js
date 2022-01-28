'use strict';
const http = require('http');
const async_hooks = require('async_hooks');
const checkInitCalled = common.mustCall();
const checkBeforeCalled = common.mustCallAtLeast();
let reusedHandleId;
async_hooks.createHook({
  init(id, type, triggerId, resource) {
    if (resource.constructor.name === 'ReusedHandle') {
      reusedHandleId = id;
      checkInitCalled();
    }
  },
  before(id) {
    if (id === reusedHandleId) {
      global.gc();
      checkBeforeCalled();
    }
  }
}).enable();
const { serverSide, clientSide } = makeDuplexPair();
const wrappedClientSide = new JSStreamSocket(clientSide);
wrappedClientSide._handle.asyncReset =
  common.mustCall(wrappedClientSide._handle.asyncReset);
const server = http.createServer(common.mustCall((req, res) => {
  res.writeHead(200, {
  });
  res.end('Hello, world!');
}, 2));
server.emit('connection', serverSide);
class TestAgent extends http.Agent {
  createConnection = common.mustCall(() => wrappedClientSide)
}
const agent = new TestAgent({ keepAlive: true, maxSockets: 1 });
function makeRequest(cb) {
  const req = http.request({ agent }, common.mustCall((res) => {
    res.resume();
    res.on('end', cb);
  }));
  req.end('');
}
const domain = require('domain');
const d = domain.create();
const noDomain = domain.create();
d.run(common.mustCall(() => {
  makeRequest(common.mustCall(() => {
    setImmediate(common.mustCall(() => {
      makeRequest(common.mustCall(() => {
        noDomain.run(common.mustCall(() => {
          setImmediate(common.mustCall(() => {
            serverSide.end();
          }));
        }));
      }));
    }));
  }));
}));
