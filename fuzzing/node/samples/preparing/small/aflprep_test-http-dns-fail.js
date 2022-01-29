'use strict';
const assert = require('assert');
const http = require('http');
function httpreq(count) {
  if (count > 1) return;
  const req = http.request({
    host: 'not-a-real-domain-name.nobody-would-register-this-as-a-tld',
    port: 80,
    method: 'GET'
  }, common.mustNotCall());
  req.on('error', common.mustCall((e) => {
    assert.strictEqual(e.code, 'ENOTFOUND');
    httpreq(count + 1);
  }));
  req.end();
}
httpreq(0);
