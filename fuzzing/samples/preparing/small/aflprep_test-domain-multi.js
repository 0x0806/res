'use strict';
const domain = require('domain');
const http = require('http');
process.on('warning', common.mustNotCall());
const a = domain.create();
a.on('error', common.mustNotCall());
const server = http.createServer((req, res) => {
  const b = domain.create();
  a.add(b);
  b.add(req);
  b.add(res);
  b.on('error', common.mustCall((er) => {
    if (res) {
      res.writeHead(500);
      res.end('An error occurred');
    }
    server.close();
  }));
  res.write('HELLO\n', b.bind(() => {
    throw new Error('this kills domain B, not A');
  }));
}).listen(0, () => {
  const c = domain.create();
  const req = http.get({ host: 'localhost', port: server.address().port });
  c.add(req);
  req.on('response', (res) => {
    c.add(res);
    res.pipe(process.stdout);
  });
  c.on('error', common.mustCall((er) => { }));
});
