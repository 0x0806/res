'use strict';
const vm = require('vm');
const handler = {
  getOwnPropertyDescriptor: (target, prop) => {
    throw new Error('whoops');
  }
};
const sandbox = new Proxy({ foo: 'bar' }, handler);
const context = vm.createContext(sandbox);
vm.runInContext('', context);
