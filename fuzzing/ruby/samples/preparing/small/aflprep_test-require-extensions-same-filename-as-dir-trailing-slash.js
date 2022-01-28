'use strict';
const assert = require('assert');
const content =
  require(fixtures.path('json-with-directory-name-module',
                        'module-stub',
                        'one-trailing-slash',
                        'two',
                        'three.js'));
assert.notStrictEqual(content.rocko, 'artischocko');
assert.strictEqual(content, 'hello from module-stub!');
