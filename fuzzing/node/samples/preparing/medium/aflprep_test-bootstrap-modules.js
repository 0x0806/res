'use strict';
const actualModules = new Set(process.moduleLoadList.slice());
const assert = require('assert');
const expectedModules = new Set([
  'Internal Binding errors',
  'Internal Binding async_wrap',
  'Internal Binding buffer',
  'Internal Binding config',
  'Internal Binding constants',
  'Internal Binding contextify',
  'Internal Binding credentials',
  'Internal Binding fs',
  'Internal Binding fs_dir',
  'Internal Binding fs_event_wrap',
  'Internal Binding heap_utils',
  'Internal Binding messaging',
  'Internal Binding module_wrap',
  'Internal Binding native_module',
  'Internal Binding options',
  'Internal Binding performance',
  'Internal Binding process_methods',
  'Internal Binding report',
  'Internal Binding serdes',
  'Internal Binding stream_wrap',
  'Internal Binding string_decoder',
  'Internal Binding symbols',
  'Internal Binding task_queue',
  'Internal Binding timers',
  'Internal Binding trace_events',
  'Internal Binding types',
  'Internal Binding url',
  'Internal Binding util',
  'Internal Binding uv',
  'Internal Binding v8',
  'Internal Binding worker',
  'NativeModule buffer',
  'NativeModule events',
  'NativeModule fs',
  'Internal Binding blob',
  'NativeModule async_hooks',
  'NativeModule path',
  'NativeModule perf_hooks',
  'NativeModule querystring',
  'NativeModule stream',
  'NativeModule string_decoder',
  'NativeModule timers',
  'NativeModule url',
  'NativeModule util',
  'NativeModule v8',
  'NativeModule vm',
]);
if (!common.isMainThread) {
  [
    'Internal Binding messaging',
    'Internal Binding performance',
    'Internal Binding symbols',
    'Internal Binding worker',
    'NativeModule stream',
    'NativeModule worker_threads',
  ].forEach(expectedModules.add.bind(expectedModules));
}
if (common.hasIntl) {
  expectedModules.add('Internal Binding icu');
} else {
  expectedModules.add('NativeModule url');
}
if (process.features.inspector) {
  expectedModules.add('Internal Binding inspector');
  expectedModules.add('Internal Binding profiler');
}
if (process.env.NODE_V8_COVERAGE) {
  expectedModules.add('Internal Binding profiler');
}
const difference = (setA, setB) => {
  return new Set([...setA].filter((x) => !setB.has(x)));
};
const missingModules = difference(expectedModules, actualModules);
const extraModules = difference(actualModules, expectedModules);
const printSet = (s) => { return `${[...s].sort().join(',\n  ')}\n`; };
assert.deepStrictEqual(actualModules, expectedModules,
                       (missingModules.size > 0 ?
                         'These modules were not loaded:\n  ' +
                         printSet(missingModules) : '') +
                       (extraModules.size > 0 ?
                         'These modules were unexpectedly loaded:\n  ' +
                         printSet(extraModules) : ''));
