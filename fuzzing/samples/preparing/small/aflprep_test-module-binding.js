'use strict';
const { internalModuleReadJSON } = internalBinding('fs');
const { readFileSync } = require('fs');
const { strictEqual } = require('assert');
{
  const [string, containsKeys] = internalModuleReadJSON('nosuchfile');
  strictEqual(string, undefined);
  strictEqual(containsKeys, undefined);
}
{
  const [string, containsKeys] =
    internalModuleReadJSON(fixtures.path('empty.txt'));
  strictEqual(string, '');
  strictEqual(containsKeys, false);
}
{
  const [string, containsKeys] =
    internalModuleReadJSON(fixtures.path('empty.txt'));
  strictEqual(string, '');
  strictEqual(containsKeys, false);
}
{
  const [string, containsKeys] =
    internalModuleReadJSON(fixtures.path('empty-with-bom.txt'));
  strictEqual(string, '');
  strictEqual(containsKeys, false);
}
{
  const [string, containsKeys] = internalModuleReadJSON(filename);
  strictEqual(string, readFileSync(filename, 'utf8'));
  strictEqual(containsKeys, true);
}
