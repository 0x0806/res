'use strict';
const assert = require('assert');
const cluster = require('cluster');
const net = require('net');
if (!cluster.isPrimary) {
  process.on('message', function() {
    process.exit(1);
  });
  return;
}
const server = net
  .createServer(function(s) {
    if (common.isWindows) {
      s.on('error', function(err) {
        if (err.code !== 'ECONNRESET') throw err;
      });
    }
    setTimeout(function() {
      s.destroy();
    }, 100);
  })
  .listen(0, function() {
    const worker = cluster.fork();
    worker.on('error', function(err) {
      if (
        err.code !== 'ECONNRESET' &&
        err.code !== 'ECONNREFUSED' &&
        err.code !== 'EMFILE'
      ) {
        throw err;
      }
    });
    function send(callback) {
      const s = net.connect(server.address().port, function() {
        worker.send({}, s, callback);
      });
      s.on('error', function(err) {
        if (
          err.code !== 'ECONNRESET' &&
          err.code !== 'ECONNREFUSED' &&
          err.code !== 'EMFILE'
        ) {
          throw err;
        }
      });
    }
    worker.process.once(
      'close',
      common.mustCall(function() {
        assert.strictEqual(worker.process.channel, null);
        server.close();
      })
    );
    worker.on('online', function() {
      send(function(err) {
        assert.ifError(err);
        send(function(err) {
          if (err && err.code !== 'ERR_IPC_CHANNEL_CLOSED' &&
                     err.code !== 'ECONNRESET' &&
                     err.code !== 'ECONNREFUSED' &&
                     err.code !== 'EMFILE') {
            throw err;
          }
        });
      });
    });
  });
