'use strict';
const { cache } = require;
Object.keys(cache).forEach((key) => {
  delete cache[key];
});
