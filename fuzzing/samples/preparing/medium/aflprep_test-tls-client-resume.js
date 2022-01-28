'use strict';
if (!common.hasCrypto)
  common.skip('missing crypto');
const assert = require('assert');
const tls = require('tls');
const options = {
  key: fixtures.readKey('agent2-key.pem'),
  cert: fixtures.readKey('agent2-cert.pem')
};
const server = tls.Server(options, common.mustCall((socket) => {
  socket.end('Goodbye');
}, 2));
server.listen(0, common.mustCall(function() {
  let sessions = 0;
  let tls13;
  const client1 = tls.connect({
    port: this.address().port,
    rejectUnauthorized: false
  }, common.mustCall(() => {
    tls13 = client1.getProtocol() === 'TLSv1.3';
    assert.strictEqual(client1.isSessionReused(), false);
    sessionx = client1.getSession();
    assert(sessionx);
    if (session1)
      reconnect();
  }));
  client1.on('data', common.mustCall((d) => {
  }));
  client1.once('session', common.mustCall((session) => {
    console.log('session1');
    session1 = session;
    assert(session1);
    if (sessionx)
      reconnect();
  }));
  client1.on('session', () => {
    console.log('client1 session#', ++sessions);
  });
  client1.on('close', () => {
    console.log('client1 close');
    assert.strictEqual(sessions, tls13 ? 2 : 1);
  });
  function reconnect() {
    assert(sessionx);
    assert(session1);
    if (tls13)
      assert.notStrictEqual(sessionx.compare(session1), 0);
    else
      assert.strictEqual(sessionx.compare(session1), 0);
    const opts = {
      port: server.address().port,
      rejectUnauthorized: false,
      session: session1,
    };
    const client2 = tls.connect(opts, common.mustCall(() => {
      console.log('connect2');
      assert.strictEqual(client2.isSessionReused(), true);
    }));
    client2.on('close', common.mustCall(() => {
      console.log('close2');
      server.close();
    }));
    client2.resume();
  }
  client1.resume();
}));
