'use strict';
const assert = require('assert');
const http = require('http');
{
  const options = {
    port: '80',
    headers: {
      host: []
    }
  };
  assert.throws(() => {
    http.request(options);
  }, {
  }, 'http request should throw when passing array as header host');
}
