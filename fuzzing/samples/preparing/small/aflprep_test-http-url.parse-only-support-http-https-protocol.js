'use strict';
const assert = require('assert');
const http = require('http');
const url = require('url');
const invalidUrls = [
  'mailto:asdf@asdf.com',
  'javascript:alert(\'hello\');',
  'xmpp:foo@bar.com',
];
invalidUrls.forEach((invalid) => {
  assert.throws(
    () => { http.request(url.parse(invalid)); },
    {
      code: 'ERR_INVALID_PROTOCOL',
      name: 'TypeError'
    }
  );
});
