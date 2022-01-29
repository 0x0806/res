'use strict';
if (!common.hasCrypto) common.skip('missing crypto');
common.requireNoPackageJSONAbove();
const assert = require('assert');
const { debuglog } = require('util');
const debug = debuglog('test');
const conditionTreePermutations = [
  ['default'],
  ['import'],
  ['node'],
  ['require'],
  ['require', 'import'],
  ['import', 'require'],
  ['default', 'require'],
  ['require', 'default'],
  ['node', 'require'],
  ['require', 'node'],
];
for (const totalDepth of [1, 2, 3]) {
  const conditionTrees = [];
  function calc(depthLeft = 0, path = []) {
    if (depthLeft) {
      for (const conditions of conditionTreePermutations) {
        calc(depthLeft - 1, [...path, conditions]);
      }
    } else {
      conditionTrees.push(path);
    }
  }
  calc(totalDepth, []);
  let nextURLId = 1;
  function getUniqueHREF() {
    const id = nextURLId++;
    return `test:${id}`;
  }
  for (const tree of conditionTrees) {
    const root = {};
    const targets = [root];
    const offsets = [-1];
    const order = [];
    while (offsets.length) {
      const depth = offsets.length - 1;
      offsets[depth]++;
      const conditionOffset = offsets[depth];
      const conditionsForDepth = tree[depth];
      if (conditionOffset >= conditionsForDepth.length) {
        offsets.pop();
        continue;
      }
      let target;
      if (depth === tree.length - 1) {
        target = getUniqueHREF();
        order.push({
          target,
          conditions: new Set(
            offsets.map(
              (conditionOffset, depth) => tree[depth][conditionOffset]
            )
          )
        });
      } else {
        target = {};
        targets[depth + 1] = target;
        offsets.push(-1);
      }
      const condition = tree[depth][conditionOffset];
      targets[depth][condition] = target;
    }
    const manifest = new Manifest({
      resources: {
        'test:_': {
          dependencies: {
            _: root
          }
        }
      }
    });
    const redirector = manifest.getDependencyMapper('test:_');
    for (const { target, conditions } of order) {
      const result = redirector.resolve('_', conditions).href;
      if (result !== target) {
        searchPriorTargets:
        for (const { target: preTarget, conditions: preConditions } of order) {
          if (result === preTarget) {
            for (const preCondition of preConditions) {
              if (conditions.has(preCondition) !== true) {
                continue searchPriorTargets;
              }
            }
            break searchPriorTargets;
          }
          if (preTarget === target) {
            debug(
              'dependencies %O expected ordering %O and trying for %j ' +
              'no prior targets matched',
              root,
              order,
              target
            );
            assert.strictEqual(
              result, target
            );
          }
        }
      }
    }
  }
}
