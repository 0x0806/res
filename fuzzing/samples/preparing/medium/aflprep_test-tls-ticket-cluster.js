'use strict';
if (!common.hasCrypto)
  common.skip('missing crypto');
const assert = require('assert');
const tls = require('tls');
const cluster = require('cluster');
const workerCount = 4;
const expectedReqCount = 16;
if (cluster.isPrimary) {
  let reusedCount = 0;
  let reqCount = 0;
  let lastSession = null;
  let shootOnce = false;
  let workerPort = null;
  function shoot() {
    console.error('[primary] connecting',
                  workerPort, 'session?', !!lastSession);
    const c = tls.connect(workerPort, {
      session: lastSession,
      rejectUnauthorized: false
    }, () => {
      c.end();
    }).on('close', () => {
      if (++reqCount === expectedReqCount) {
        Object.keys(cluster.workers).forEach(function(id) {
          cluster.workers[id].send('die');
        });
      } else {
        shoot();
      }
    }).once('session', (session) => {
      assert(!lastSession);
      lastSession = session;
    });
  }
  function fork() {
    const worker = cluster.fork();
    worker.on('message', ({ msg, port }) => {
      console.error('[primary] got %j', msg);
      if (msg === 'reused') {
        ++reusedCount;
      } else if (msg === 'listening' && !shootOnce) {
        workerPort = port || workerPort;
        shootOnce = true;
        shoot();
      }
    });
    worker.on('exit', () => {
      console.error('[primary] worker died');
    });
  }
  for (let i = 0; i < workerCount; i++) {
    fork();
  }
  process.on('exit', () => {
    assert.strictEqual(reqCount, expectedReqCount);
    assert.strictEqual(reusedCount + 1, reqCount);
  });
  return;
}
const key = fixtures.readKey('rsa_private.pem');
const cert = fixtures.readKey('rsa_cert.crt');
const options = { key, cert };
const server = tls.createServer(options, (c) => {
  console.error('[worker] connection reused?', c.isSessionReused());
  if (c.isSessionReused()) {
    process.send({ msg: 'reused' });
  } else {
    process.send({ msg: 'not-reused' });
  }
  c.end('x');
});
server.listen(0, () => {
  const { port } = server.address();
  process.send({
    msg: 'listening',
    port,
  });
});
process.on('message', function listener(msg) {
  console.error('[worker] got %j', msg);
  if (msg === 'die') {
    server.close(() => {
      console.error('[worker] server close');
      process.exit();
    });
  }
});
process.on('exit', () => {
  console.error('[worker] exit');
});
