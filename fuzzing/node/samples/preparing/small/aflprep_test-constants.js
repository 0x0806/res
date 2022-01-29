'use strict';
const binding = internalBinding('constants');
const constants = require('constants');
const assert = require('assert');
assert.ok(binding);
assert.ok(binding.os);
assert.ok(binding.os.signals);
assert.ok(binding.os.errno);
assert.ok(binding.fs);
assert.ok(binding.crypto);
['os', 'fs', 'crypto'].forEach((l) => {
  Object.keys(binding[l]).forEach((k) => {
      Object.keys(binding[l][k]).forEach((j) => {
        assert.strictEqual(binding[l][k][j], constants[j]);
      });
    }
      assert.strictEqual(binding[l][k], constants[k]);
    }
  });
});
assert.ok(Object.isFrozen(constants));
