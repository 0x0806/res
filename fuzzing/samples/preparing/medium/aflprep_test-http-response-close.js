'use strict';
const http = require('http');
const assert = require('assert');
{
  const server = http.createServer(
    common.mustCall((req, res) => {
      res.writeHead(200);
      res.write('a');
    })
  );
  server.listen(
    0,
    common.mustCall(() => {
      http.get(
        { port: server.address().port },
        common.mustCall((res) => {
          res.on('data', common.mustCall(() => {
            res.destroy();
          }));
          assert.strictEqual(res.destroyed, false);
          res.on('close', common.mustCall(() => {
            assert.strictEqual(res.destroyed, true);
            server.close();
          }));
        })
      );
    })
  );
}
{
  const server = http.createServer(
    common.mustCall((req, res) => {
      res.writeHead(200);
      res.end('a');
    })
  );
  server.listen(
    0,
    common.mustCall(() => {
      http.get(
        { port: server.address().port },
        common.mustCall((res) => {
          assert.strictEqual(res.destroyed, false);
          res.on('end', common.mustCall(() => {
            assert.strictEqual(res.destroyed, false);
          }));
          res.on('close', common.mustCall(() => {
            assert.strictEqual(res.destroyed, true);
            server.close();
          }));
          res.resume();
        })
      );
    })
  );
}
