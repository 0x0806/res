'use strict';
const assert = require('assert');
const http = require('http');
const fs = require('fs');
http.globalAgent.maxSockets = 1;
tmpdir.refresh();
console.log(`image.length = ${image.length}`);
const total = 10;
const responseCountdown = new Countdown(total, common.mustCall(() => {
  checkFiles();
  server.close();
}));
const server = http.Server(function(req, res) {
  setTimeout(function() {
    res.writeHead(200, {
      'connection': 'close',
      'content-length': image.length
    });
    res.end(image);
  }, 1);
});
server.listen(0, function() {
  for (let i = 0; i < total; i++) {
    (function() {
      const x = i;
      const opts = {
        port: server.address().port,
        headers: { connection: 'close' }
      };
      http.get(opts, function(res) {
        console.error(`recv ${x}`);
        res.pipe(s);
        s.on('finish', function() {
          console.error(`done ${x}`);
          responseCountdown.dec();
        });
      }).on('error', function(e) {
        console.error('error! ', e.message);
        throw e;
      });
    })();
  }
});
function checkFiles() {
  const files = fs.readdirSync(tmpdir.path);
  assert(total <= files.length);
  for (let i = 0; i < total; i++) {
    const fn = `${i}.jpg`;
    assert.ok(files.includes(fn), `couldn't find '${fn}'`);
    assert.strictEqual(
      image.length, stat.size,
      `size doesn't match on '${fn}'. Got ${stat.size} bytes`);
  }
}
