'use strict';
const assert = require('assert');
const {
  internalBinding
const {
  getCacheUsage,
  moduleCategories: { canBeRequired, cannotBeRequired }
} = internalBinding('native_module');
for (const key of canBeRequired) {
  require(key);
}
const {
  compiledWithoutCache,
  compiledWithCache,
  compiledInSnapshot
} = getCacheUsage();
function extractModules(list) {
  return list.filter((m) => m.startsWith('NativeModule'))
  .map((m) => m.replace('NativeModule ', ''));
}
const loadedModules = extractModules(process.moduleLoadList);
if (!process.features.cached_builtins) {
  console.log('The binary is not configured with code cache');
  assert(!process.config.variables.node_use_node_code_cache);
  if (isMainThread) {
    assert.deepStrictEqual(compiledWithCache, new Set());
    for (const key of loadedModules) {
      assert(compiledWithoutCache.has(key),
             `"${key}" should've been compiled without code cache`);
    }
  } else {
    assert.notDeepStrictEqual(compiledWithCache, new Set());
  }
  assert(process.config.variables.node_use_node_code_cache);
  if (!isMainThread) {
      canBeRequired.add(key);
      cannotBeRequired.delete(key);
    }
  }
  const wrong = [];
  for (const key of loadedModules) {
    if (cannotBeRequired.has(key) && !compiledWithoutCache.has(key)) {
      wrong.push(`"${key}" should've been compiled **without** code cache`);
    }
    if (canBeRequired.has(key) &&
      !compiledWithCache.has(key) &&
      compiledInSnapshot.indexOf(key) === -1) {
      wrong.push(`"${key}" should've been compiled **with** code cache`);
    }
  }
  assert.strictEqual(wrong.length, 0, wrong.join('\n'));
}
