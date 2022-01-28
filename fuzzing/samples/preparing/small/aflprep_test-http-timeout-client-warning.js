'use strict';
const http = require('http');
const assert = require('assert');
process.on('warning', common.mustCall((warning) => {
  assert(warning.stack.includes(__filename));
}));
const server = http.createServer((req, resp) => resp.end());
server.listen(common.mustCall(() => {
    .setTimeout(2 ** 40)
    .on('response', common.mustCall(() => {
      server.close();
    }))
    .end();
}));
