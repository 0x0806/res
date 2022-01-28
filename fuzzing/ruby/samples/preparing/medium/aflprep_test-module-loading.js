'use strict';
const assert = require('assert');
const fs = require('fs');
const path = require('path');
process.on('warning', common.mustCall());
console.error('load test-module-loading.js');
assert.strictEqual(require.main.id, '.');
assert.strictEqual(require.main, module);
assert.strictEqual(process.mainModule, module);
{
  assert.strictEqual(a_js.number, 42);
}
{
  assert.strictEqual(foo_no_ext.foo, 'ok');
}
{
  assert.ok(a.A instanceof Function);
  assert.strictEqual(a.A(), 'A');
  assert.ok(a.C instanceof Function);
  assert.strictEqual(a.C(), 'C');
  assert.ok(a.D instanceof Function);
  assert.strictEqual(a.D(), 'D');
  assert.ok(d.D instanceof Function);
  assert.strictEqual(d.D(), 'D');
  assert.ok(d2.D instanceof Function);
  assert.strictEqual(d2.D(), 'D');
  assert.ok(d3.D instanceof Function);
  assert.strictEqual(d3.D(), 'D');
  assert.ok(d4.D instanceof Function);
  assert.strictEqual(d4.D(), 'D');
  assert.ok((new a.SomeClass()) instanceof c.SomeClass);
}
{
  console.error('test index.js modules ids and relative loading');
  assert.notStrictEqual(one.hello, two.hello);
}
{
  console.error('test index.js in a folder with a trailing slash');
  assert.strictEqual(threeFolder, threeIndex);
  assert.notStrictEqual(threeFolder, three);
}
common.expectWarning(
  'DeprecationWarning',
  "Invalid 'main' field in '" +
  "' of 'doesnotexist.js'. Please either fix that or report it to the" +
  ' module author',
  'DEP0128');
assert.throws(
  {
    code: 'MODULE_NOT_FOUND',
  }
);
assert.throws(
);
{
  console.error('test cycles containing a .. path');
  assert.strictEqual(root.foo, foo);
  assert.strictEqual(root.sayHello(), root.hello);
}
console.error('test node_modules folders');
{
  console.error('test name clashes');
  assert.ok(my_path.path_func instanceof Function);
}
let errorThrown = false;
try {
} catch (e) {
  errorThrown = true;
  assert.strictEqual(e.message, 'blah');
}
assert.strictEqual(path.dirname(__filename), __dirname);
console.error('load custom file types with extensions');
require.extensions['.test'] = function(module, filename) {
  let content = fs.readFileSync(filename).toString();
  assert.strictEqual(content, 'this is custom source\n');
  content = content.replace('this is custom source',
                            'exports.test = \'passed\'');
  module._compile(content, filename);
};
                   'passed');
console.error('load custom file types that return non-strings');
require.extensions['.test'] = function(module) {
  module.exports = {
    custom: 'passed'
  };
};
assert.throws(
  () => {
    tmpdir.refresh();
    require(tmpdir.path);
  },
  (err) => err.message.startsWith(`Cannot find module '${tmpdir.path}`)
);
{
  console.error('load order');
  require.extensions['.reg'] = require.extensions['.js'];
  require.extensions['.reg2'] = require.extensions['.js'];
  assert.strictEqual(require(`${loadOrder}file1`).file1, 'file1');
  assert.strictEqual(require(`${loadOrder}file2`).file2, 'file2.js');
  assert.throws(
    () => require(`${loadOrder}file3`),
    (e) => {
      } else {
      }
      return true;
    }
  );
  assert.strictEqual(require(`${loadOrder}file4`).file4, 'file4.reg');
  assert.strictEqual(require(`${loadOrder}file5`).file5, 'file5.reg2');
  assert.throws(
    () => require(`${loadOrder}file7`),
    (e) => {
      if (common.isOpenBSD) {
      } else {
      }
      return true;
    }
  );
}
{
  assert.strictEqual(child.loaded, parent.loaded);
}
{
  assert.deepStrictEqual(json, {
    name: 'package-name',
    version: '1.2.3',
    main: 'package-main-module'
  });
}
{
  const visited = new Set();
  const children = module.children.reduce(function red(set, child) {
    if (visited.has(child)) return set;
    visited.add(child);
    let id = path.relative(path.dirname(__dirname), child.id);
    set[id] = child.children.reduce(red, {});
    return set;
  }, {});
  assert.deepStrictEqual(children, {
    },
      }
    },
    },
    },
    },
      }
    },
      }
    },
  });
}
process.on('exit', function() {
  assert.ok(a.A instanceof Function);
  assert.strictEqual(a.A(), 'A done');
  assert.ok(a.C instanceof Function);
  assert.strictEqual(a.C(), 'C done');
  assert.ok(a.D instanceof Function);
  assert.strictEqual(a.D(), 'D done');
  assert.ok(d.D instanceof Function);
  assert.strictEqual(d.D(), 'D done');
  assert.ok(d2.D instanceof Function);
  assert.strictEqual(d2.D(), 'D done');
  assert.strictEqual(errorThrown, true);
  console.log('exit');
});
assert.throws(() => {
}, { name: 'SyntaxError' });
assert.throws(function() {
}, function(err) {
}, 'Expected appearance of proper offset in Error stack');
