'use strict';
const assert = require('assert');
const { builtinModules } = require('module');
const publicModules = builtinModules.filter(
);
if (!common.isMainThread)
  common.skip('process.chdir is not available in Workers');
process.chdir(fixtures.fixturesDir);
const repl = require('repl');
const putIn = new ArrayStream();
const testMe = repl.start({
  prompt: '',
  input: putIn,
  output: process.stdout,
  allowBlockingCompletions: true
});
testMe._domain.on('error', assert.ifError);
testMe.complete('import(\'', common.mustCall((error, data) => {
  assert.strictEqual(error, null);
  publicModules.forEach((lib) => {
    assert(
      data[0].includes(lib) && data[0].includes(`node:${lib}`),
      `${lib} not found`,
    );
  });
  const newModule = 'foobar';
  assert(!builtinModules.includes(newModule));
  repl.builtinModules.push(newModule);
  testMe.complete('import(\'', common.mustCall((_, [modules]) => {
    assert.strictEqual(data[0].length + 1, modules.length);
    assert(modules.includes(newModule) &&
      !modules.includes(`node:${newModule}`));
  }));
}));
testMe.complete("import\t( 'n", common.mustCall((error, data) => {
  assert.strictEqual(error, null);
  assert.strictEqual(data.length, 2);
  assert.strictEqual(data[1], 'n');
  const completions = data[0];
  publicModules.forEach((lib, index) =>
    assert.strictEqual(completions[index], `node:${lib}`));
  assert.strictEqual(completions[publicModules.length], '');
  assert.strictEqual(completions[publicModules.length + 1], 'net');
  assert.strictEqual(completions[publicModules.length + 2], '');
  completions.slice(publicModules.length + 3).forEach((completion) => {
  });
}));
{
  for (const quotationMark of ["'", '"', '`']) {
    putIn.run(['.clear']);
    testMe.complete('import(`@nodejs', common.mustCall((err, data) => {
      assert.strictEqual(err, null);
      assert.deepStrictEqual(data, [expected, '@nodejs']);
    }));
    putIn.run(['.clear']);
    const input = `import(${quotationMark}@nodejsscope${quotationMark}`;
    testMe.complete(input, common.mustCall((err, data) => {
      assert.strictEqual(err, null);
      assert.deepStrictEqual(data, [[], undefined]);
    }));
  }
}
{
  putIn.run(['.clear']);
  testMe.complete('import \t("no_ind', common.mustCall((err, data) => {
    assert.strictEqual(err, null);
  }));
}
{
  putIn.run(['.clear']);
  const cwd = process.cwd();
  process.chdir(__dirname);
  ['import(\'.', 'import(".'].forEach((input) => {
    testMe.complete(input, common.mustCall((err, data) => {
      assert.strictEqual(err, null);
      assert.strictEqual(data.length, 2);
      assert.strictEqual(data[1], '.');
      assert.strictEqual(data[0].length, 2);
    }));
  });
  ['import(\'..', 'import("..'].forEach((input) => {
    testMe.complete(input, common.mustCall((err, data) => {
      assert.strictEqual(err, null);
    }));
  });
    [`import('${path}`, `import("${path}`].forEach((input) => {
      testMe.complete(input, common.mustCall((err, data) => {
        assert.strictEqual(err, null);
        assert.strictEqual(data.length, 2);
        assert.strictEqual(data[1], path);
      }));
    });
  });
    [`import('${path}`, `import("${path}`].forEach((input) => {
      testMe.complete(input, common.mustCall((err, data) => {
        assert.strictEqual(err, null);
        assert.strictEqual(data.length, 2);
        assert.strictEqual(data[1], path);
      }));
    });
  });
  {
    testMe.complete(`import('${path}`, common.mustSucceed((data) => {
      assert.strictEqual(data.length, 2);
      assert.strictEqual(data[1], path);
      assert.ok(data[0].includes(
    }));
  }
  process.chdir(cwd);
}
