'use strict';
if (!common.hasCrypto)
  common.skip('missing crypto');
const assert = require('assert');
const tls = require('tls');
const net = require('net');
const crypto = require('crypto');
const keys = crypto.randomBytes(48);
const serverLog = [];
const ticketLog = [];
let s;
let serverCount = 0;
function createServer() {
  const id = serverCount++;
  let counter = 0;
  let previousKey = null;
  const server = tls.createServer({
    key: fixtures.readKey('agent1-key.pem'),
    cert: fixtures.readKey('agent1-cert.pem'),
    ticketKeys: keys
  }, function(c) {
    serverLog.push(id);
    c.end('x');
    counter++;
    function setTicketKeys(keys) {
      if (c.isSessionReused())
        server.setTicketKeys(keys);
      else
        s.once('session', () => {
          server.setTicketKeys(keys);
        });
    }
    if (counter === 1) {
      previousKey = server.getTicketKeys();
      assert.strictEqual(previousKey.compare(keys), 0);
      setTicketKeys(crypto.randomBytes(48));
    } else if (counter === 2) {
      setTicketKeys(previousKey);
    } else if (counter === 3) {
    } else {
      throw new Error('UNREACHABLE');
    }
  });
  return server;
}
const naturalServers = [ createServer(), createServer(), createServer() ];
const servers = naturalServers.concat(naturalServers).concat(naturalServers);
const shared = net.createServer(function(c) {
  servers.shift().emit('connection', c);
}).listen(0, function() {
  start(function() {
    shared.close();
  });
});
const onNewSession = common.mustCall((s, session) => {
  assert(session);
  assert.strictEqual(session.compare(s.getSession()), 0);
}, 4);
function start(callback) {
  let sess = null;
  let left = servers.length;
  function connect() {
    s = tls.connect(shared.address().port, {
      session: sess,
      rejectUnauthorized: false
    }, function() {
      if (s.isSessionReused())
        ticketLog.push(s.getTLSTicket().toString('hex'));
    });
    s.on('data', () => {
      s.end();
    });
    s.on('close', function() {
      if (--left === 0)
        callback();
      else
        connect();
    });
    s.on('session', (session) => {
      sess = sess || session;
    });
    s.once('session', (session) => onNewSession(s, session));
    s.once('session', () => ticketLog.push(s.getTLSTicket().toString('hex')));
  }
  connect();
}
process.on('exit', function() {
  assert.strictEqual(ticketLog.length, serverLog.length);
  for (let i = 0; i < naturalServers.length - 1; i++) {
    assert.notStrictEqual(serverLog[i], serverLog[i + 1]);
    assert.strictEqual(ticketLog[i], ticketLog[i + 1]);
    assert.notStrictEqual(ticketLog[i], ticketLog[i + naturalServers.length]);
    assert.strictEqual(ticketLog[i], ticketLog[i + naturalServers.length * 2]);
  }
});
