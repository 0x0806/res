'use strict';
if (!common.hasCrypto)
  common.skip('missing crypto');
const assert = require('assert');
const https = require('https');
const agent = new https.Agent();
const options = {
  key: fixtures.readKey('agent1-key.pem'),
  cert: fixtures.readKey('agent1-cert.pem'),
};
const checkRequest = (socket, server) => {
  let result = '';
  socket.on('connect', common.mustCall((data) => {
    socket.end();
  }));
  socket.on('data', common.mustCall((chunk) => {
    result += chunk;
  }));
  socket.on('end', common.mustCall(() => {
    assert.match(result, expectedHeader);
    assert.match(result, expectedBody);
    server.close();
  }));
};
function createServer() {
  return https.createServer(options, (req, res) => {
    res.end('hello world\n');
  });
}
{
  const server = createServer();
  server.listen(0, common.mustCall(() => {
    const port = server.address().port;
    const host = 'localhost';
    const options = {
      port: port,
      host: host,
      rejectUnauthorized: false,
      _agentKey: agent.getName({ port, host })
    };
    const socket = agent.createConnection(options);
    checkRequest(socket, server);
  }));
}
{
  const server = createServer();
  server.listen(0, common.mustCall(() => {
    const port = server.address().port;
    const host = 'localhost';
    const options = {
      rejectUnauthorized: false,
      _agentKey: agent.getName({ port, host })
    };
    const socket = agent.createConnection(port, options);
    checkRequest(socket, server);
  }));
}
{
  const server = createServer();
  server.listen(0, common.mustCall(() => {
    const port = server.address().port;
    const host = 'localhost';
    const options = {
      rejectUnauthorized: false,
      _agentKey: agent.getName({ port, host })
    };
    const socket = agent.createConnection(port, host, options);
    checkRequest(socket, server);
  }));
}
{
  const server = createServer();
  server.listen(0, common.mustCall(() => {
    const port = server.address().port;
    const host = 'localhost';
    const options = {
      rejectUnauthorized: false,
    };
    const socket = agent.createConnection(port, host, options);
    checkRequest(socket, server);
  }));
}
{
  const server = createServer();
  server.listen(0, common.mustCall(() => {
    const port = server.address().port;
    const host = 'localhost';
    const options = null;
    const socket = agent.createConnection(port, host, options);
    socket.on('error', common.mustCall((e) => {
      assert.match(e.toString(), expectCertError);
      server.close();
    }));
  }));
}
{
  const server = createServer();
  server.listen(0, common.mustCall(() => {
    const port = server.address().port;
    const host = 'localhost';
    const options = undefined;
    const socket = agent.createConnection(port, host, options);
    socket.on('error', common.mustCall((e) => {
      assert.match(e.toString(), expectCertError);
      server.close();
    }));
  }));
}
{
  const server = createServer();
  server.listen(0, common.mustCall(() => {
    const port = server.address().port;
    const host = 'localhost';
    const options = {
      port: 3000,
      rejectUnauthorized: false
    };
    const socket = agent.createConnection(port, host, options);
    socket.on('connect', common.mustCall((data) => {
      socket.end();
    }));
    socket.on('end', common.mustCall(() => {
      assert.deepStrictEqual(options, {
        port: 3000, rejectUnauthorized: false
      });
      server.close();
    }));
  }));
}
