'use strict';
if (!common.hasCrypto)
  common.skip('missing crypto');
const assert = require('assert');
const tls = require('tls');
const options = {
  key: fixtures.readKey('rsa_private.pem'),
  cert: fixtures.readKey('rsa_cert.crt')
};
const bufSize = 1024 * 1024;
let sent = 0;
let received = 0;
const server = tls.Server(options, common.mustCall((socket) => {
  socket.pipe(socket);
  socket.on('data', (c) => {
    console.error('data', c.length);
  });
}));
server.listen(0, common.mustCall(() => {
  let resumed = false;
  const client = tls.connect({
    port: server.address().port,
    rejectUnauthorized: false
  }, common.mustCall(() => {
    console.error('connected');
    client.pause();
    console.error('paused');
    const send = (() => {
      console.error('sending');
      const ret = client.write(Buffer.allocUnsafe(bufSize));
      console.error(`write => ${ret}`);
      if (ret !== false) {
        console.error('write again');
        sent += bufSize;
        return process.nextTick(send);
      }
      sent += bufSize;
      console.error(`sent: ${sent}`);
      resumed = true;
      client.resume();
      console.error('resumed', client);
    })();
  }));
  client.on('data', (data) => {
    console.error('data');
    assert.ok(resumed);
    received += data.length;
    console.error('received', received);
    console.error('sent', sent);
    if (received >= sent) {
      console.error(`received: ${received}`);
      client.end();
      server.close();
    }
  });
}));
process.on('exit', () => {
  assert.strictEqual(sent, received);
});
