'use strict';
const http = require('http');
const server = http.createServer((req, res) => {
  const buffer = Buffer.alloc(0);
                       'Content-Length': buffer.length });
  res.end(buffer);
});
server.listen(0, common.mustCall(() => {
  http.get({ port: server.address().port }, common.mustCall((res) => {
    res.on('data', common.mustNotCall());
    res.on('end', (d) => {
      server.close();
    });
  }));
}));
