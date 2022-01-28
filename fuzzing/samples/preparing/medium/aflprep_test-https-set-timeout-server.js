'use strict';
if (!common.hasCrypto)
  common.skip('missing crypto');
const assert = require('assert');
const https = require('https');
const http = require('http');
const tls = require('tls');
const tests = [];
const serverOptions = {
  key: fixtures.readKey('agent1-key.pem'),
  cert: fixtures.readKey('agent1-cert.pem')
};
function test(fn) {
  if (!tests.length)
    process.nextTick(run);
  tests.push(common.mustCall(fn));
}
function run() {
  const fn = tests.shift();
  if (fn) {
    fn(run);
  }
}
test(function serverTimeout(cb) {
  const server = https.createServer(serverOptions);
  server.listen(common.mustCall(() => {
    const s = server.setTimeout(50, common.mustCall((socket) => {
      socket.destroy();
      server.close();
      cb();
    }));
    assert.ok(s instanceof https.Server);
    https.get({
      port: server.address().port,
      rejectUnauthorized: false
    }).on('error', common.mustCall());
  }));
});
test(function serverRequestTimeout(cb) {
  const server = https.createServer(
    serverOptions,
    common.mustCall((req, res) => {
      const s = req.setTimeout(50, common.mustCall((socket) => {
        socket.destroy();
        server.close();
        cb();
      }));
      assert.ok(s instanceof http.IncomingMessage);
    }));
  server.listen(common.mustCall(() => {
    const req = https.request({
      port: server.address().port,
      method: 'POST',
      rejectUnauthorized: false
    });
    req.on('error', common.mustCall());
    req.write('Hello');
  }));
});
test(function serverResponseTimeout(cb) {
  const server = https.createServer(
    serverOptions,
    common.mustCall((req, res) => {
      const s = res.setTimeout(50, common.mustCall((socket) => {
        socket.destroy();
        server.close();
        cb();
      }));
      assert.ok(s instanceof http.OutgoingMessage);
    }));
  server.listen(common.mustCall(() => {
    https.get({
      port: server.address().port,
      rejectUnauthorized: false
    }).on('error', common.mustCall());
  }));
});
test(function serverRequestNotTimeoutAfterEnd(cb) {
  const server = https.createServer(
    serverOptions,
    common.mustCall((req, res) => {
      const s = req.setTimeout(50, common.mustNotCall());
      assert.ok(s instanceof http.IncomingMessage);
      res.on('timeout', common.mustCall());
    }));
  server.on('timeout', common.mustCall((socket) => {
    socket.destroy();
    server.close();
    cb();
  }));
  server.listen(common.mustCall(() => {
    https.get({
      port: server.address().port,
      rejectUnauthorized: false
    }).on('error', common.mustCall());
  }));
});
test(function serverResponseTimeoutWithPipeline(cb) {
  let caughtTimeout = '';
  let secReceived = false;
  process.on('exit', () => {
  });
  const server = https.createServer(serverOptions, (req, res) => {
      secReceived = true;
      res.end();
      return;
    }
    const s = res.setTimeout(50, () => {
      caughtTimeout += req.url;
    });
    assert.ok(s instanceof http.OutgoingMessage);
  });
  server.on('timeout', common.mustCall((socket) => {
    if (secReceived) {
      socket.destroy();
      server.close();
      cb();
    }
  }));
  server.listen(common.mustCall(() => {
    const options = {
      port: server.address().port,
      allowHalfOpen: true,
      rejectUnauthorized: false
    };
    const c = tls.connect(options, () => {
    });
  }));
});
test(function idleTimeout(cb) {
  const server = https.createServer(serverOptions);
  const s = server.setTimeout(50, common.mustCall((socket) => {
    socket.destroy();
    server.close();
    cb();
  }));
  assert.ok(s instanceof https.Server);
  server.listen(common.mustCall(() => {
    const options = {
      port: server.address().port,
      allowHalfOpen: true,
      rejectUnauthorized: false
    };
    const c = tls.connect(options, () => {
      c.on('error', (e) => {
        if (e.message !== 'read ECONNRESET')
          throw e;
      });
    });
  }));
});
test(function fastTimeout(cb) {
  let connectionHandlerInvoked = false;
  let timeoutHandlerInvoked = false;
  let connectionSocket;
  function invokeCallbackIfDone() {
    if (connectionHandlerInvoked && timeoutHandlerInvoked) {
      connectionSocket.destroy();
      server.close();
      cb();
    }
  }
  const server = https.createServer(serverOptions, common.mustCall(
    (req, res) => {
      req.on('timeout', common.mustNotCall());
      res.end();
      connectionHandlerInvoked = true;
      invokeCallbackIfDone();
    }
  ));
  const s = server.setTimeout(1, common.mustCall((socket) => {
    connectionSocket = socket;
    timeoutHandlerInvoked = true;
    invokeCallbackIfDone();
  }));
  assert.ok(s instanceof https.Server);
  server.listen(common.mustCall(() => {
    const options = {
      port: server.address().port,
      allowHalfOpen: true,
      rejectUnauthorized: false
    };
    const c = tls.connect(options, () => {
    });
  }));
});
