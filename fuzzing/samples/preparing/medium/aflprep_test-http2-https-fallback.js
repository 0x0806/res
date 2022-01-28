'use strict';
if (!common.hasCrypto)
  common.skip('missing crypto');
const { strictEqual, ok } = require('assert');
const { createSecureContext } = require('tls');
const { createSecureServer, connect } = require('http2');
const { get } = require('https');
const { parse } = require('url');
const { connect: tls } = require('tls');
const countdown = (count, done) => () => --count === 0 && done();
const key = fixtures.readKey('agent8-key.pem');
const cert = fixtures.readKey('agent8-cert.pem');
const ca = fixtures.readKey('fake-startcom-root-cert.pem');
const clientOptions = { secureContext: createSecureContext({ ca }) };
function onRequest(request, response) {
  const { socket: { alpnProtocol } } = request.httpVersion === '2.0' ?
    request.stream.session : request;
  response.end(JSON.stringify({
    alpnProtocol,
    httpVersion: request.httpVersion
  }));
}
function onSession(session, next) {
  const headers = {
    ':method': 'GET',
    ':scheme': 'https',
    ':authority': `localhost:${this.server.address().port}`
  };
  const request = session.request(headers);
  request.on('response', common.mustCall((headers) => {
    strictEqual(headers[':status'], 200);
  }));
  request.setEncoding('utf8');
  let raw = '';
  request.on('data', (chunk) => { raw += chunk; });
  request.on('end', common.mustCall(() => {
    const { alpnProtocol, httpVersion } = JSON.parse(raw);
    strictEqual(alpnProtocol, 'h2');
    strictEqual(httpVersion, '2.0');
    session.close();
    this.cleanup();
    if (typeof next === 'function') {
      next();
    }
  }));
  request.end();
}
{
  const server = createSecureServer(
    { cert, key, allowHTTP1: true },
    common.mustCall(onRequest, 2)
  );
  server.listen(0);
  server.on('listening', common.mustCall(() => {
    const { port } = server.address();
    const cleanup = countdown(2, () => server.close());
    connect(
      origin,
      clientOptions,
      common.mustCall(onSession.bind({ cleanup, server }))
    );
    get(
      Object.assign(parse(origin), clientOptions),
      common.mustCall((response) => {
        strictEqual(response.statusCode, 200);
        strictEqual(response.statusMessage, 'OK');
        response.setEncoding('utf8');
        let raw = '';
        response.on('data', (chunk) => { raw += chunk; });
        response.on('end', common.mustCall(() => {
          const { alpnProtocol, httpVersion } = JSON.parse(raw);
          strictEqual(alpnProtocol, false);
          strictEqual(httpVersion, '1.1');
          cleanup();
        }));
      })
    );
  }));
}
{
  const server = createSecureServer(
    { cert, key },
    common.mustCall(onRequest)
  );
  server.once('unknownProtocol', common.mustCall((socket) => {
    socket.destroy();
  }));
  server.listen(0);
  server.on('listening', common.mustCall(() => {
    const { port } = server.address();
    const cleanup = countdown(3, () => server.close());
    connect(
      origin,
      clientOptions,
      common.mustCall(function(session) {
        onSession.call({ cleanup, server },
                       session,
                       common.mustCall(testNoTls));
      })
    );
    function testNoTls() {
      get(Object.assign(parse(origin), clientOptions), common.mustNotCall)
        .on('error', common.mustCall(cleanup))
        .on('error', common.mustCall(testWrongALPN))
        .end();
    }
    function testWrongALPN() {
      let text = '';
      tls(Object.assign({ port, ALPNProtocols: ['fake'] }, clientOptions))
        .setEncoding('utf8')
        .on('data', (chunk) => text += chunk)
        .on('end', common.mustCall(() => {
          cleanup();
        }));
    }
  }));
}
