'use strict';
const assert = require('assert');
common.expectWarning(
  'DeprecationWarning',
  'module.parent is deprecated due to accuracy issues. Please use ' +
    'require.main to find program entry point instead.',
  'DEP0144'
);
assert.strictEqual(module.parent, null);
