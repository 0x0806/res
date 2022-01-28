'use strict';
const assert = require('assert');
const http = require('http');
let serverEndCb = false;
let serverIncoming = '';
const serverIncomingExpect = 'bazquuxblerg';
let clientEndCb = false;
let clientIncoming = '';
const clientIncomingExpect = 'asdffoobar';
process.on('exit', () => {
  assert(serverEndCb);
  assert.strictEqual(serverIncoming, serverIncomingExpect);
  assert(clientEndCb);
  assert.strictEqual(clientIncoming, clientIncomingExpect);
  console.log('ok');
});
const server = http.createServer((req, res) => {
  res.statusCode = 400;
  res.end('Bad Request.\nMust send Expect:100-continue\n');
});
server.on('checkContinue', (req, res) => {
  server.close();
  assert.strictEqual(req.method, 'PUT');
  res.writeContinue(() => {
    req.on('end', () => {
      res.write('asdf', (er) => {
        assert.ifError(er);
        res.write('foo', 'ascii', (er) => {
          assert.ifError(er);
          res.end(Buffer.from('bar'), 'buffer', (er) => {
            serverEndCb = true;
          });
        });
      });
    });
  });
  req.setEncoding('ascii');
  req.on('data', (c) => {
    serverIncoming += c;
  });
});
server.listen(0, function() {
  const req = http.request({
    port: this.address().port,
    method: 'PUT',
    headers: { 'expect': '100-continue' }
  });
  req.on('continue', () => {
    req.write('YmF6', 'base64', (er) => {
      assert.ifError(er);
      req.write(Buffer.from('quux'), (er) => {
        assert.ifError(er);
        req.end('626c657267', 'hex', (er) => {
          assert.ifError(er);
          clientEndCb = true;
        });
      });
    });
  });
  req.on('response', (res) => {
    assert(clientEndCb);
    res.setEncoding('ascii');
    res.on('data', (c) => {
      clientIncoming += c;
    });
  });
});
