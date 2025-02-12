'use strict';
const assert = require('assert');
const http = require('http');
const stream = require('stream');
for (const method of ['GET, HEAD']) {
  const expected = ['a', 'b', '', Buffer.alloc(0), 'c'];
  const results = [];
  const writable = new stream.Writable({
    write(chunk, encoding, callback) {
      callback();
    }
  });
  const res = new http.ServerResponse({
    method: method,
    httpVersionMajor: 1,
    httpVersionMinor: 1
  });
  res.assignSocket(writable);
  for (const chunk of expected) {
    res.write(chunk, () => {
      results.push(chunk);
    });
  }
  res.end(common.mustCall(() => {
    assert.deepStrictEqual(results, expected);
  }));
}
