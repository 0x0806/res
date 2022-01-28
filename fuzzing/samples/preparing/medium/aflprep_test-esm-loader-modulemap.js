'use strict';
const assert = require('assert');
const createDynamicModule = require(
const stubModule = createDynamicModule(['default'], stubModuleUrl);
const loader = new ESMLoader();
const moduleMap = new ModuleMap();
const moduleJob = new ModuleJob(loader, stubModule.module,
                                () => new Promise(() => {}));
assert.throws(
  () => moduleMap.get(1),
  {
    code: 'ERR_INVALID_ARG_TYPE',
    name: 'TypeError',
    message: 'The "url" argument must be of type string. Received type number' +
             ' (1)'
  }
);
assert.throws(
  () => moduleMap.set(1, moduleJob),
  {
    code: 'ERR_INVALID_ARG_TYPE',
    name: 'TypeError',
    message: 'The "url" argument must be of type string. Received type number' +
             ' (1)'
  }
);
assert.throws(
  () => moduleMap.set('somestring', 'notamodulejob'),
  {
    code: 'ERR_INVALID_ARG_TYPE',
    name: 'TypeError',
    message: 'The "job" argument must be an instance of ModuleJob. ' +
             "Received type string ('notamodulejob')"
  }
);
assert.throws(
  () => moduleMap.has(1),
  {
    code: 'ERR_INVALID_ARG_TYPE',
    name: 'TypeError',
    message: 'The "url" argument must be of type string. Received type number' +
             ' (1)'
  }
);
