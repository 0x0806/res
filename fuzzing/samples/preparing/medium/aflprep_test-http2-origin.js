'use strict';
const {
  hasCrypto,
  mustCall,
  mustNotCall,
  skip
if (!hasCrypto)
  skip('missing crypto');
const {
  deepStrictEqual,
  strictEqual,
  throws
} = require('assert');
const {
  createSecureServer,
  createServer,
  connect
} = require('http2');
const key = readKey('agent8-key.pem', 'binary');
const cert = readKey('agent8-cert.pem', 'binary');
const ca = readKey('fake-startcom-root-cert.pem', 'binary');
{
  const server = createSecureServer({ key, cert });
  server.on('stream', mustCall((stream) => {
    stream.respond();
    stream.end('ok');
  }));
  server.on('session', mustCall((session) => {
    session.origin();
    [0, true, {}, []].forEach((input) => {
      throws(
        () => session.origin(input),
        {
          code: 'ERR_INVALID_ARG_TYPE',
          name: 'TypeError'
        }
      );
    });
      throws(
        () => session.origin(input),
        {
          code: 'ERR_HTTP2_INVALID_ORIGIN',
          name: 'TypeError'
        }
      );
    });
    ['not a valid url'].forEach((input) => {
      throws(
        () => session.origin(input),
        {
          code: 'ERR_INVALID_URL',
          name: 'TypeError'
        }
      );
    });
    throws(
      () => session.origin(longInput),
      {
        code: 'ERR_HTTP2_ORIGIN_LENGTH',
        name: 'TypeError'
      }
    );
  }));
  server.listen(0, mustCall(() => {
    const client = connect(originSet[0], { ca });
    const checks = [
    ];
    const countdown = new Countdown(3, () => {
      client.close();
      server.close();
    });
    client.on('origin', mustCall((origins) => {
      const check = checks.shift();
      originSet.push(...check);
      deepStrictEqual(client.originSet, originSet);
      deepStrictEqual(origins, check);
      countdown.dec();
    }, 2));
    client.request().on('close', mustCall(() => countdown.dec())).resume();
  }));
}
{
  const server = createSecureServer({ key, cert, origins });
  server.on('stream', mustCall((stream) => {
    stream.respond();
    stream.end('ok');
  }));
  server.listen(0, mustCall(() => {
    const client = connect(originSet[0], { ca });
    const countdown = new Countdown(2, () => {
      client.close();
      server.close();
    });
    client.on('origin', mustCall((origins) => {
      originSet.push(...check);
      deepStrictEqual(client.originSet, originSet);
      deepStrictEqual(origins, check);
      countdown.dec();
    }));
    client.request().on('close', mustCall(() => countdown.dec())).resume();
  }));
}
{
  const server = createSecureServer({ key, cert });
  server.on('stream', mustCall((stream) => {
    stream.respond({ ':status': 421 });
    stream.end();
  }));
  server.on('session', mustCall((session) => {
  }));
  server.listen(0, mustCall(() => {
    const client = connect(origin, { ca });
    client.on('origin', mustCall((origins) => {
      const req = client.request({ ':authority': 'foo.org' });
      req.on('response', mustCall((headers) => {
        strictEqual(headers[':status'], 421);
        deepStrictEqual(client.originSet, [origin]);
      }));
      req.resume();
      req.on('close', mustCall(() => {
        client.close();
        server.close();
      }));
    }, 1));
  }));
}
{
  const server = createServer();
  server.on('stream', mustCall((stream) => {
    stream.respond();
    stream.end('ok');
  }));
  server.listen(0, mustCall(() => {
    client.on('origin', mustNotCall());
    strictEqual(client.originSet, undefined);
    const req = client.request();
    req.resume();
    req.on('close', mustCall(() => {
      client.close();
      server.close();
    }));
  }));
}
