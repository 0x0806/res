'use strict';
const assert = require('assert');
const path = require('path');
assert.strictEqual(
  require.resolve('dep'),
  path.join(__dirname, 'node_modules', 'dep', 'index.js')
);
const paths = [path.resolve(__dirname, '..', 'defined')];
assert.strictEqual(
  require.resolve('dep', { paths }),
  path.join(paths[0], 'node_modules', 'dep', 'index.js')
);
