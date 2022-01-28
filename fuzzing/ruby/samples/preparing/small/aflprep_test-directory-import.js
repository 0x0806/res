'use strict';
const assert = require('assert');
const { pathToFileURL } = require('url');
{
  assert.rejects(
    import(pathToFileURL(fixtures.path('packages', 'main'))),
  );
}
