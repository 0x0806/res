'use strict';
const assert = require('assert');
const versionParts = process.versions.node.split('.');
assert.strictEqual(process.release.name, 'node');
if (versionParts[0] === '4' && versionParts[1] >= 2) {
  assert.strictEqual(process.release.lts, 'Argon');
} else if (versionParts[0] === '6' && versionParts[1] >= 9) {
  assert.strictEqual(process.release.lts, 'Boron');
} else if (versionParts[0] === '8' && versionParts[1] >= 9) {
  assert.strictEqual(process.release.lts, 'Carbon');
} else if (versionParts[0] === '10' && versionParts[1] >= 13) {
  assert.strictEqual(process.release.lts, 'Dubnium');
} else if (versionParts[0] === '12' && versionParts[1] >= 13) {
  assert.strictEqual(process.release.lts, 'Erbium');
} else if (versionParts[0] === '14' && versionParts[1] >= 15) {
  assert.strictEqual(process.release.lts, 'Fermium');
} else if (versionParts[0] === '16' && versionParts[1] >= 13) {
  assert.strictEqual(process.release.lts, 'Gallium');
} else {
  assert.strictEqual(process.release.lts, undefined);
}
