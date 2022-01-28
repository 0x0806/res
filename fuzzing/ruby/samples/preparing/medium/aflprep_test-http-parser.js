'use strict';
const assert = require('assert');
const { methods, HTTPParser } = require('_http_common');
const { REQUEST, RESPONSE } = HTTPParser;
const kOnHeaders = HTTPParser.kOnHeaders | 0;
const kOnHeadersComplete = HTTPParser.kOnHeadersComplete | 0;
const kOnBody = HTTPParser.kOnBody | 0;
const kOnMessageComplete = HTTPParser.kOnMessageComplete | 0;
function newParser(type) {
  const parser = new HTTPParser();
  parser.initialize(type, {});
  parser.headers = [];
  parser.url = '';
  parser[kOnHeaders] = function(headers, url) {
    parser.headers = parser.headers.concat(headers);
    parser.url += url;
  };
  parser[kOnHeadersComplete] = function() {
  };
  parser[kOnBody] = mustNotCall('kOnBody should not be called');
  parser[kOnMessageComplete] = function() {
  };
  return parser;
}
function expectBody(expected) {
  return mustCall(function(buf, start, len) {
    const body = String(buf.slice(start, start + len));
    assert.strictEqual(body, expected);
  });
}
{
  const onHeadersComplete = (versionMajor, versionMinor, headers,
                             method, url) => {
    assert.strictEqual(versionMajor, 1);
    assert.strictEqual(versionMinor, 1);
    assert.strictEqual(method, methods.indexOf('GET'));
  };
  const parser = newParser(REQUEST);
  parser[kOnHeadersComplete] = mustCall(onHeadersComplete);
  parser.execute(request, 0, request.length);
  parser[kOnHeadersComplete] = function() {
    throw new Error('hello world');
  };
  parser.initialize(REQUEST, {});
  assert.throws(
    () => { parser.execute(request, 0, request.length); },
    { name: 'Error', message: 'hello world' }
  );
}
{
  const request = Buffer.from(
    'Content-Length: 4\r\n' +
    '\r\n' +
    'pong'
  );
  const onHeadersComplete = (versionMajor, versionMinor, headers,
                             method, url, statusCode, statusMessage) => {
    assert.strictEqual(method, undefined);
    assert.strictEqual(versionMajor, 1);
    assert.strictEqual(versionMinor, 1);
    assert.strictEqual(statusCode, 200);
    assert.strictEqual(statusMessage, 'OK');
  };
  const onBody = (buf, start, len) => {
    const body = String(buf.slice(start, start + len));
    assert.strictEqual(body, 'pong');
  };
  const parser = newParser(RESPONSE);
  parser[kOnHeadersComplete] = mustCall(onHeadersComplete);
  parser[kOnBody] = mustCall(onBody);
  parser.execute(request, 0, request.length);
}
{
  const request = Buffer.from(
  const onHeadersComplete = (versionMajor, versionMinor, headers,
                             method, url, statusCode, statusMessage) => {
    assert.strictEqual(versionMajor, 1);
    assert.strictEqual(versionMinor, 0);
    assert.strictEqual(method, undefined);
    assert.strictEqual(statusCode, 200);
    assert.strictEqual(statusMessage, 'Connection established');
    assert.deepStrictEqual(headers || parser.headers, []);
  };
  const parser = newParser(RESPONSE);
  parser[kOnHeadersComplete] = mustCall(onHeadersComplete);
  parser.execute(request, 0, request.length);
}
{
  const request = Buffer.from(
    'Transfer-Encoding: chunked\r\n' +
    '\r\n' +
    '4\r\n' +
    'ping\r\n' +
    '0\r\n' +
    'Vary: *\r\n' +
    '\r\n'
  );
  let seen_body = false;
  const onHeaders = (headers) => {
    assert.deepStrictEqual(headers,
  };
  const onHeadersComplete = (versionMajor, versionMinor, headers,
                             method, url) => {
    assert.strictEqual(method, methods.indexOf('POST'));
    assert.strictEqual(versionMajor, 1);
    assert.strictEqual(versionMinor, 1);
    parser[kOnHeaders] = mustCall(onHeaders);
  };
  const onBody = (buf, start, len) => {
    const body = String(buf.slice(start, start + len));
    assert.strictEqual(body, 'ping');
    seen_body = true;
  };
  const parser = newParser(REQUEST);
  parser[kOnHeadersComplete] = mustCall(onHeadersComplete);
  parser[kOnBody] = mustCall(onBody);
  parser.execute(request, 0, request.length);
}
{
  const request = Buffer.from(
    'X-Filler: 1337\r\n' +
    'X-Filler:   42\r\n' +
    'X-Filler2:  42\r\n' +
    '\r\n'
  );
  const onHeadersComplete = (versionMajor, versionMinor, headers,
                             method) => {
    assert.strictEqual(method, methods.indexOf('GET'));
    assert.strictEqual(versionMajor, 1);
    assert.strictEqual(versionMinor, 0);
    assert.deepStrictEqual(
      headers || parser.headers,
      ['X-Filler', '1337', 'X-Filler', '42', 'X-Filler2', '42']);
  };
  const parser = newParser(REQUEST);
  parser[kOnHeadersComplete] = mustCall(onHeadersComplete);
  parser.execute(request, 0, request.length);
}
{
  const lots_of_headers = 'X-Filler: 42\r\n'.repeat(256);
  const request = Buffer.from(
    lots_of_headers +
    '\r\n'
  );
  const onHeadersComplete = (versionMajor, versionMinor, headers,
                             method, url) => {
    assert.strictEqual(method, methods.indexOf('GET'));
    assert.strictEqual(versionMajor, 1);
    assert.strictEqual(versionMinor, 0);
    headers = headers || parser.headers;
    for (let i = 0; i < headers.length; i += 2) {
      assert.strictEqual(headers[i], 'X-Filler');
      assert.strictEqual(headers[i + 1], '42');
    }
  };
  const parser = newParser(REQUEST);
  parser[kOnHeadersComplete] = mustCall(onHeadersComplete);
  parser.execute(request, 0, request.length);
}
{
  const request = Buffer.from(
    'Content-Length: 15\r\n' +
    '\r\n' +
    'foo=42&bar=1337'
  );
  const onHeadersComplete = (versionMajor, versionMinor, headers,
                             method, url) => {
    assert.strictEqual(method, methods.indexOf('POST'));
    assert.strictEqual(versionMajor, 1);
    assert.strictEqual(versionMinor, 1);
  };
  const onBody = (buf, start, len) => {
    const body = String(buf.slice(start, start + len));
    assert.strictEqual(body, 'foo=42&bar=1337');
  };
  const parser = newParser(REQUEST);
  parser[kOnHeadersComplete] = mustCall(onHeadersComplete);
  parser[kOnBody] = mustCall(onBody);
  parser.execute(request, 0, request.length);
}
{
  const request = Buffer.from(
    'Transfer-Encoding: chunked\r\n' +
    '\r\n' +
    '3\r\n' +
    '123\r\n' +
    '6\r\n' +
    '123456\r\n' +
    'A\r\n' +
    '1234567890\r\n' +
    '0\r\n'
  );
  const onHeadersComplete = (versionMajor, versionMinor, headers,
                             method, url) => {
    assert.strictEqual(method, methods.indexOf('POST'));
    assert.strictEqual(versionMajor, 1);
    assert.strictEqual(versionMinor, 1);
  };
  let body_part = 0;
  const body_parts = ['123', '123456', '1234567890'];
  const onBody = (buf, start, len) => {
    const body = String(buf.slice(start, start + len));
    assert.strictEqual(body, body_parts[body_part++]);
  };
  const parser = newParser(REQUEST);
  parser[kOnHeadersComplete] = mustCall(onHeadersComplete);
  parser[kOnBody] = mustCall(onBody, body_parts.length);
  parser.execute(request, 0, request.length);
}
{
  let request = Buffer.from(
    'Transfer-Encoding: chunked\r\n' +
    '\r\n' +
    '3\r\n' +
    '123\r\n' +
    '6\r\n' +
    '123456\r\n'
  );
  const onHeadersComplete = (versionMajor, versionMinor, headers,
                             method, url) => {
    assert.strictEqual(method, methods.indexOf('POST'));
    assert.strictEqual(versionMajor, 1);
    assert.strictEqual(versionMinor, 1);
  };
  let body_part = 0;
  const body_parts =
          ['123', '123456', '123456789', '123456789ABC', '123456789ABCDEF'];
  const onBody = (buf, start, len) => {
    const body = String(buf.slice(start, start + len));
    assert.strictEqual(body, body_parts[body_part++]);
  };
  const parser = newParser(REQUEST);
  parser[kOnHeadersComplete] = mustCall(onHeadersComplete);
  parser[kOnBody] = mustCall(onBody, body_parts.length);
  parser.execute(request, 0, request.length);
  request = Buffer.from(
    '9\r\n' +
    '123456789\r\n' +
    'C\r\n' +
    '123456789ABC\r\n' +
    'F\r\n' +
    '123456789ABCDEF\r\n' +
    '0\r\n'
  );
  parser.execute(request, 0, request.length);
}
{
  const request = Buffer.from(
    'Transfer-Encoding: chunked\r\n' +
    '\r\n' +
    '3\r\n' +
    '123\r\n' +
    '6\r\n' +
    '123456\r\n' +
    '9\r\n' +
    '123456789\r\n' +
    'C\r\n' +
    '123456789ABC\r\n' +
    'F\r\n' +
    '123456789ABCDEF\r\n' +
    '0\r\n'
  );
  function test(a, b) {
    const onHeadersComplete = (versionMajor, versionMinor, headers,
                               method, url) => {
      assert.strictEqual(method, methods.indexOf('POST'));
      assert.strictEqual(versionMajor, 1);
      assert.strictEqual(versionMinor, 1);
    };
    let expected_body = '123123456123456789123456789ABC123456789ABCDEF';
    const onBody = (buf, start, len) => {
      const chunk = String(buf.slice(start, start + len));
      assert.strictEqual(expected_body.indexOf(chunk), 0);
      expected_body = expected_body.slice(chunk.length);
    };
    const parser = newParser(REQUEST);
    parser[kOnHeadersComplete] = mustCall(onHeadersComplete);
    parser[kOnBody] = onBody;
    parser.execute(a, 0, a.length);
    parser.execute(b, 0, b.length);
    assert.strictEqual(expected_body, '');
  }
  for (let i = 1; i < request.length - 1; ++i) {
    const a = request.slice(0, i);
    console.error(`request.slice(0, ${i}) = ${JSON.stringify(a.toString())}`);
    const b = request.slice(i);
    console.error(`request.slice(${i}) = ${JSON.stringify(b.toString())}`);
    test(a, b);
  }
}
{
  const request = Buffer.from(
    'Transfer-Encoding: chunked\r\n' +
    '\r\n' +
    '3\r\n' +
    '123\r\n' +
    '6\r\n' +
    '123456\r\n' +
    '9\r\n' +
    '123456789\r\n' +
    'C\r\n' +
    '123456789ABC\r\n' +
    'F\r\n' +
    '123456789ABCDEF\r\n' +
    '0\r\n'
  );
  const onHeadersComplete = (versionMajor, versionMinor, headers,
                             method, url) => {
    assert.strictEqual(method, methods.indexOf('POST'));
    assert.strictEqual(versionMajor, 1);
    assert.strictEqual(versionMinor, 1);
    assert.deepStrictEqual(
      headers || parser.headers,
  };
  let expected_body = '123123456123456789123456789ABC123456789ABCDEF';
  const onBody = (buf, start, len) => {
    const chunk = String(buf.slice(start, start + len));
    assert.strictEqual(expected_body.indexOf(chunk), 0);
    expected_body = expected_body.slice(chunk.length);
  };
  const parser = newParser(REQUEST);
  parser[kOnHeadersComplete] = mustCall(onHeadersComplete);
  parser[kOnBody] = onBody;
  for (let i = 0; i < request.length; ++i) {
    parser.execute(request, i, 1);
  }
  assert.strictEqual(expected_body, '');
}
{
  const req1 = Buffer.from(
    'Transfer-Encoding: chunked\r\n' +
    '\r\n' +
    '4\r\n' +
    'ping\r\n' +
    '0\r\n'
  );
  const req2 = Buffer.from(
    'Content-Length: 4\r\n' +
    '\r\n' +
    'pong'
  );
  const onHeadersComplete1 = (versionMajor, versionMinor, headers,
                              method, url) => {
    assert.strictEqual(method, methods.indexOf('PUT'));
    assert.strictEqual(versionMajor, 1);
    assert.strictEqual(versionMinor, 1);
    assert.deepStrictEqual(
      headers,
  };
  const onHeadersComplete2 = (versionMajor, versionMinor, headers,
                              method, url) => {
    assert.strictEqual(method, methods.indexOf('POST'));
    assert.strictEqual(versionMajor, 1);
    assert.strictEqual(versionMinor, 0);
    assert.deepStrictEqual(
      headers,
    );
  };
  const parser = newParser(REQUEST);
  parser[kOnHeadersComplete] = onHeadersComplete1;
  parser[kOnBody] = expectBody('ping');
  parser.execute(req1, 0, req1.length);
  parser.initialize(REQUEST, req2);
  parser[kOnBody] = expectBody('pong');
  parser[kOnHeadersComplete] = onHeadersComplete2;
  parser.execute(req2, 0, req2.length);
}
assert.throws(function() {
  const parser = newParser(REQUEST);
  const notparser = { execute: parser.execute };
  notparser.execute(request, 0, request.length);
}, TypeError);
