'use strict';
const assert = require('assert');
const fs = require('fs');
const path = require('path');
assert(process.hasOwnProperty('config'));
assert.strictEqual(Object(process.config), process.config);
const configPath = path.resolve(__dirname, '..', '..', 'config.gypi');
if (!fs.existsSync(configPath)) {
  common.skip('config.gypi does not exist.');
}
let config = fs.readFileSync(configPath, 'utf8');
config = config.split('\n').slice(1).join('\n');
config = JSON.parse(config, (key, value) => {
  if (value === 'true') return true;
  if (value === 'false') return false;
  return value;
});
try {
  assert.deepStrictEqual(config, process.config);
} catch (e) {
  console.log('config:', config);
  console.log('process.config:', process.config);
  throw e;
}
