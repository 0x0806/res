'use strict';
const assert = require('assert');
assert(options instanceof SafeMap,
assert(aliases instanceof SafeMap,
Map.prototype.get =
  common.mustNotCall('`getOptionValue` must not call user-mutable method');
assert.strictEqual(getOptionValue('--expose-internals'), true);
