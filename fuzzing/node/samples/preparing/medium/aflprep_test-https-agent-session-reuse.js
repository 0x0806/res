'use strict';
const assert = require('assert');
if (!common.hasCrypto)
  common.skip('missing crypto');
const https = require('https');
const crypto = require('crypto');
const options = {
  key: fixtures.readKey('agent1-key.pem'),
  cert: fixtures.readKey('agent1-cert.pem')
};
const ca = fixtures.readKey('ca1-cert.pem');
const clientSessions = {};
let serverRequests = 0;
const agent = new https.Agent({
  maxCachedSessions: 1
});
const server = https.createServer(options, function(req, res) {
    server.setTicketKeys(crypto.randomBytes(48));
  serverRequests++;
  res.end('ok');
}).listen(0, function() {
  const queue = [
    {
      name: 'first',
      method: 'GET',
      servername: 'agent1',
      ca: ca,
      port: this.address().port
    },
    {
      name: 'first-reuse',
      method: 'GET',
      servername: 'agent1',
      ca: ca,
      port: this.address().port
    },
    {
      name: 'cipher-change',
      method: 'GET',
      servername: 'agent1',
      ciphers: 'AES256-SHA',
      ca: ca,
      port: this.address().port
    },
    {
      name: 'before-drop',
      method: 'GET',
      servername: 'agent1',
      ca: ca,
      port: this.address().port
    },
    {
      name: 'after-drop',
      method: 'GET',
      servername: 'agent1',
      ca: ca,
      port: this.address().port
    },
    {
      name: 'after-drop-reuse',
      method: 'GET',
      servername: 'agent1',
      ca: ca,
      port: this.address().port
    },
  ];
  function request() {
    const options = queue.shift();
    options.agent = agent;
    https.request(options, function(res) {
      clientSessions[options.name] = res.socket.getSession();
      res.resume();
      res.on('end', function() {
        if (queue.length !== 0)
          return request();
        server.close();
      });
    }).end();
  }
  request();
});
process.on('exit', function() {
  assert.strictEqual(serverRequests, 6);
  assert.strictEqual(clientSessions.first.toString('hex'),
                     clientSessions['first-reuse'].toString('hex'));
  assert.notStrictEqual(clientSessions.first.toString('hex'),
                        clientSessions['cipher-change'].toString('hex'));
  assert.notStrictEqual(clientSessions.first.toString('hex'),
                        clientSessions['before-drop'].toString('hex'));
  assert.notStrictEqual(clientSessions['cipher-change'].toString('hex'),
                        clientSessions['before-drop'].toString('hex'));
  assert.notStrictEqual(clientSessions['before-drop'].toString('hex'),
                        clientSessions['after-drop'].toString('hex'));
  assert.strictEqual(clientSessions['after-drop'].toString('hex'),
                     clientSessions['after-drop-reuse'].toString('hex'));
});
