'use strict';
if (common.isSunOS)
  common.skip(`Unsupported platform [${process.platform}]`);
if (common.isIBMi)
  common.skip('Unsupported platform IBMi');
const assert = require('assert');
assert.strictEqual(process.title, 'foo');
