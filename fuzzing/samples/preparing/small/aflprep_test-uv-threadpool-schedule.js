'use strict';
const dns = require('dns');
const fs = require('fs');
const assert = require('assert');
const start = Date.now();
const slowIOmax = 100;
let slowIOcount = 0;
let fastIOdone = false;
let slowIOend, fastIOend;
function onResolve() {
  slowIOcount++;
  if (slowIOcount === slowIOmax) {
    slowIOend = Date.now();
    assert.ok(fastIOdone,
    const fastIOtime = fastIOend - start;
    const slowIOtime = slowIOend - start;
    assert.ok(fastIOtime < expectedMax,
              `actual: ${fastIOtime}, expected: ${expectedMax}`);
  }
}
for (let i = 0; i < slowIOmax; i++) {
  dns.lookup(`${randomDomain()}.com`, {}, common.mustCall(onResolve));
}
fs.readFile(__filename, common.mustCall(() => {
  fastIOend = Date.now();
  fastIOdone = true;
}));
function randomDomain() {
  const d = Buffer.alloc(10);
  for (let i = 0; i < 10; i++)
    d[i] = 97 + (Math.round(Math.random() * 13247)) % 26;
  return d.toString();
}
