'use strict';
const assert = require('assert');
const zlib = require('zlib');
global.gc();
const before = process.memoryUsage().external;
for (let i = 0; i < 100; ++i)
  zlib.createGzip();
const afterCreation = process.memoryUsage().external;
global.gc();
const afterGC = process.memoryUsage().external;
       `Expected after-GC delta ${afterGC - before} to be less than 5 %` +
       ` of before-GC delta ${afterCreation - before}`);
