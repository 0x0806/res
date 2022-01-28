'use strict';
const assert = require('assert');
const http = require('http');
const multipleAllowed = [
  'Accept',
  'Accept-Charset',
  'Accept-Encoding',
  'Accept-Language',
  'Connection',
  'Cookie',
  'X-Forwarded-For',
  'Some-Random-Header',
  'X-Some-Random-Header',
];
const multipleForbidden = [
  'Content-Type',
  'User-Agent',
  'Referer',
  'Host',
  'Authorization',
  'Proxy-Authorization',
  'If-Modified-Since',
  'If-Unmodified-Since',
  'From',
  'Location',
  'Max-Forwards',
];
const server = http.createServer(function(req, res) {
  multipleForbidden.forEach(function(header) {
    assert.strictEqual(req.headers[header.toLowerCase()], 'foo',
                       `header parsed incorrectly: ${header}`);
  });
  multipleAllowed.forEach(function(header) {
    const sep = (header.toLowerCase() === 'cookie' ? '; ' : ', ');
    assert.strictEqual(req.headers[header.toLowerCase()], `foo${sep}bar`,
                       `header parsed incorrectly: ${header}`);
  });
  res.end('EOF');
  server.close();
});
function makeHeader(value) {
  return function(header) {
    return [header, value];
  };
}
const headers = []
  .concat(multipleAllowed.map(makeHeader('foo')))
  .concat(multipleForbidden.map(makeHeader('foo')))
  .concat(multipleAllowed.map(makeHeader('bar')))
  .concat(multipleForbidden.map(makeHeader('bar')));
server.listen(0, function() {
  http.get({
    host: 'localhost',
    port: this.address().port,
    headers: headers,
  });
});
