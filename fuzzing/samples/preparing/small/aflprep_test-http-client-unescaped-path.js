'use strict';
const assert = require('assert');
const http = require('http');
for (let i = 0; i <= 32; i += 1) {
  const path = `bad${String.fromCharCode(i)}path`;
  assert.throws(
    () => http.get({ path }, common.mustNotCall()),
    {
      code: 'ERR_UNESCAPED_CHARACTERS',
      name: 'TypeError',
      message: 'Request path contains unescaped characters'
    }
  );
}
