'use strict';
const assert = require('assert');
const http = require('http');
http.createServer(function(req, res) {
  req.resume();
  req.on('end', function() {
    write(res);
  });
  this.close();
}).listen(0, function() {
  const req = http.request({
    port: this.address().port,
    method: 'PUT'
  });
  write(req);
  req.on('response', function(res) {
    res.resume();
  });
});
const buf = Buffer.alloc(1024 * 16, 'x');
function write(out) {
  const name = out.constructor.name;
  let finishEvent = false;
  let endCb = false;
  while (out.write(buf, common.mustSucceed())) {}
  out.on('finish', function() {
    finishEvent = true;
    console.error(`${name} finish event`);
    process.nextTick(function() {
      assert(endCb, `${name} got finish event before endcb!`);
      console.log(`ok - ${name} finishEvent`);
    });
  });
  out.end(buf, common.mustCall(function() {
    endCb = true;
    console.error(`${name} endCb`);
    process.nextTick(function() {
      assert(finishEvent, `${name} got endCb event before finishEvent!`);
      console.log(`ok - ${name} endCb`);
    });
  }));
}
