'use strict';
const http = require('http');
const net = require('net');
const url = require('url');
const assert = require('assert');
            '0%c4%8d%c4%8aLast­Modified:%20Mon,%2027%20Oct%202003%2014:50:18' +
const y = 'foo⠊Set-Cookie: foo=bar';
let count = 0;
const countdown = new Countdown(3, () => server.close());
function test(res, code, key, value) {
  const header = { [key]: value };
  assert.throws(
    () => res.writeHead(code, header),
    {
      code: 'ERR_INVALID_CHAR',
      name: 'TypeError',
      message: `Invalid character in header content ["${key}"]`
    }
  );
}
const server = http.createServer((req, res) => {
  switch (count++) {
    case 0:
      const loc = url.parse(req.url, true).query.lang;
      break;
    case 1:
      test(res, 200, 'foo', x);
      break;
    case 2:
      test(res, 200, 'foo', y);
      break;
    default:
      assert.fail('should not get to here.');
  }
  countdown.dec();
  res.end('ok');
});
server.listen(0, () => {
  const client = net.connect({ port: server.address().port }, () => {
    client.write(`GET ${str} ${end}`);
    client.end();
  });
});
