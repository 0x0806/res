'use strict';
const domain = require('domain');
const http = require('http');
const assert = require('assert');
const debug = require('util').debuglog('test');
process.on('warning', common.mustNotCall());
const objects = { foo: 'bar', baz: {}, num: 42, arr: [1, 2, 3] };
objects.baz.asdf = objects;
let serverCaught = 0;
let clientCaught = 0;
const server = http.createServer(function(req, res) {
  const dom = domain.create();
  req.resume();
  dom.add(req);
  dom.add(res);
  dom.on('error', function(er) {
    serverCaught++;
    debug('horray! got a server error', er);
    res.end(er.stack || er.message || 'Unknown error');
  });
  dom.run(function() {
    assert.notStrictEqual(data, undefined);
    res.writeHead(200);
    res.end(data);
  });
});
server.listen(0, next);
function next() {
  const port = this.address().port;
  debug(`listening on localhost:${port}`);
  let requests = 0;
  let responses = 0;
  function makeReq(p) {
    requests++;
    const dom = domain.create();
    dom.on('error', function(er) {
      clientCaught++;
      debug('client error', er);
      req.socket.destroy();
    });
    const req = http.get({ host: 'localhost', port: port, path: p });
    dom.add(req);
    req.on('response', function(res) {
      responses++;
      debug(`requests=${requests} responses=${responses}`);
      if (responses === requests) {
        debug('done, closing server');
        server.close();
      }
      dom.add(res);
      let d = '';
      res.on('data', function(c) {
        d += c;
      });
      res.on('end', function() {
        debug('trying to parse json', d);
        d = JSON.parse(d);
        debug('json!', d);
      });
    });
  }
}
process.on('exit', function() {
  assert.strictEqual(serverCaught, 2);
  assert.strictEqual(clientCaught, 2);
  debug('ok');
});
