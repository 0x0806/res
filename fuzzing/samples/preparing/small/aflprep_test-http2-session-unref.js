'use strict';
if (!common.hasCrypto)
  common.skip('missing crypto');
const http2 = require('http2');
const server = http2.createServer();
const { clientSide, serverSide } = makeDuplexPair();
const counter = new Countdown(3, () => server.unref());
server.on('session', common.mustCallAtLeast((session) => {
  counter.dec();
  session.unref();
}, 3));
server.listen(0, common.mustCall(() => {
  const port = server.address().port;
  {
    client.unref();
  }
  {
    client.on('connect', common.mustCall(() => {
      client.destroy();
      client.unref();
    }));
  }
  {
      createConnection: common.mustCall(() => clientSide)
    });
    client.on('connect', common.mustCall(() => {
      client.destroy();
      client.unref();
    }));
  }
}));
server.emit('connection', serverSide);
