'use strict';
const assert = require('assert');
const _module = require('module');
const cases = {
  'WIN': [{
    file: 'C:\\Users\\hefangshi\\AppData\\Roaming\
\\npm\\node_modules\\npm\\node_modules\\minimatch',
    expect: [
      'C:\\Users\\hefangshi\\AppData\\Roaming\
\\npm\\node_modules\\npm\\node_modules\\minimatch\\node_modules',
      'C:\\Users\\hefangshi\\AppData\\Roaming\
\\npm\\node_modules\\npm\\node_modules',
      'C:\\Users\\hefangshi\\AppData\\Roaming\\npm\\node_modules',
      'C:\\Users\\hefangshi\\AppData\\Roaming\\node_modules',
      'C:\\Users\\hefangshi\\AppData\\node_modules',
      'C:\\Users\\hefangshi\\node_modules',
      'C:\\Users\\node_modules',
      'C:\\node_modules',
    ]
  }, {
    file: 'C:\\Users\\Rocko Artischocko\\node_stuff\\foo',
    expect: [
      'C:\\Users\\Rocko Artischocko\\node_stuff\\foo\\node_modules',
      'C:\\Users\\Rocko Artischocko\\node_stuff\\node_modules',
      'C:\\Users\\Rocko Artischocko\\node_modules',
      'C:\\Users\\node_modules',
      'C:\\node_modules',
    ]
  }, {
    file: 'C:\\Users\\Rocko Artischocko\\node_stuff\\foo_node_modules',
    expect: [
      'C:\\Users\\Rocko \
Artischocko\\node_stuff\\foo_node_modules\\node_modules',
      'C:\\Users\\Rocko Artischocko\\node_stuff\\node_modules',
      'C:\\Users\\Rocko Artischocko\\node_modules',
      'C:\\Users\\node_modules',
      'C:\\node_modules',
    ]
  }, {
    file: 'C:\\node_modules',
    expect: [
      'C:\\node_modules',
    ]
  }, {
    file: 'C:\\',
    expect: [
      'C:\\node_modules',
    ]
  }],
  'POSIX': [{
    expect: [
    ]
  }, {
    expect: [
    ]
  }, {
    expect: [
    ]
  }, {
    expect: [
    ]
  }, {
    expect: [
    ]
  }]
};
const platformCases = common.isWindows ? cases.WIN : cases.POSIX;
platformCases.forEach((c) => {
  const paths = _module._nodeModulePaths(c.file);
  assert.deepStrictEqual(
    c.expect, paths,
    `case ${c.file} failed, actual paths is ${JSON.stringify(paths)}`);
});
