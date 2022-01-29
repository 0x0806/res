'use strict';
const http = require('http');
const url = require('url');
const server = http.createServer(common.mustCall((req, res) => {
  res.end();
})).listen(0, '127.0.0.1', common.mustCall(() => {
  opts.agent = new http.Agent();
  opts.agent.protocol = null;
  http.get(opts, common.mustCall((res) => {
    res.resume();
    server.close();
  }));
}));
