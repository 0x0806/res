'use strict';
const assert = require('assert');
const cluster = require('cluster');
const net = require('net');
function forEach(obj, fn) {
  Object.keys(obj).forEach(function(name, index) {
    fn(obj[name], name);
  });
}
if (cluster.isWorker) {
  const server = net.Server();
  let socket, message;
  function maybeReply() {
    if (!socket || !message) return;
    socket.write(JSON.stringify({
      code: 'received message',
      echo: message
    }));
  }
  server.on('connection', function(socket_) {
    socket = socket_;
    maybeReply();
    process.send('message from worker');
  });
  process.on('message', function(message_) {
    message = message_;
    maybeReply();
  });
  server.listen(0, '127.0.0.1');
} else if (cluster.isPrimary) {
  const checks = {
    global: {
      'receive': false,
      'correct': false
    },
    primary: {
      'receive': false,
      'correct': false
    },
    worker: {
      'receive': false,
      'correct': false
    }
  };
  let client;
  const check = (type, result) => {
    checks[type].receive = true;
    checks[type].correct = result;
    console.error('check', checks);
    let missing = false;
    forEach(checks, function(type) {
      if (type.receive === false) missing = true;
    });
    if (missing === false) {
      console.error('end client');
      client.end();
    }
  };
  const worker = cluster.fork();
  worker.on('message', function(message) {
    check('primary', message === 'message from worker');
  });
  cluster.on('message', function(worker_, message) {
    assert.strictEqual(worker_, worker);
    check('global', message === 'message from worker');
  });
  worker.on('listening', function(address) {
    client = net.connect(address.port, function() {
      worker.send('message from primary');
    });
    client.on('data', function(data) {
      data = JSON.parse(data.toString());
      if (data.code === 'received message') {
        check('worker', data.echo === 'message from primary');
      } else {
        throw new Error(`wrong TCP message received: ${data}`);
      }
    });
    client.on('end', function() {
      worker.kill();
    });
    worker.on('exit', common.mustCall(function() {
      process.exit(0);
    }));
  });
  process.once('exit', function() {
    forEach(checks, function(check, type) {
      assert.ok(check.receive, `The ${type} did not receive any message`);
      assert.ok(check.correct, `The ${type} did not get the correct message`);
    });
  });
}
