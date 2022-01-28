'use strict';
const assert = require('assert');
const net = require('net');
const repl = require('repl');
const { inspect } = require('util');
const message = 'Read, Eval, Print Loop';
const prompt_unix = 'node via Unix socket> ';
const prompt_tcp = 'node via TCP socket> ';
const moduleFilename = fixtures.path('a');
global.invoke_me = function(arg) {
  return `invoked ${arg}`;
};
async function runReplTests(socket, prompt, tests) {
  let lineBuffer = '';
  for (const { send, expect } of tests) {
    const expectedLines = Array.isArray(expect) ? expect : [ expect ];
    console.error('out:', JSON.stringify(send));
    socket.write(`${send}\n`);
    for (let expectedLine of expectedLines) {
      if (expectedLine === kSource)
        expectedLine = send;
      while (!lineBuffer.includes('\n')) {
        lineBuffer += await event(socket, expect);
        while (lineBuffer.startsWith(prompt))
          lineBuffer = lineBuffer.substr(prompt.length);
        if (lineBuffer === expectedLine && !expectedLine.includes('\n'))
          lineBuffer += '\n';
      }
      const newlineOffset = lineBuffer.indexOf('\n');
      let actualLine = lineBuffer.substr(0, newlineOffset);
      lineBuffer = lineBuffer.substr(newlineOffset + 1);
      while (actualLine.startsWith(prompt))
        actualLine = actualLine.substr(prompt.length);
      console.error('in:', JSON.stringify(actualLine));
      if (typeof expectedLine === 'string') {
        assert.strictEqual(actualLine, expectedLine);
      } else {
        assert.match(actualLine, expectedLine);
      }
    }
  }
  const remainder = socket.read();
  assert(remainder === '' || remainder === null);
}
const unixTests = [
  {
    send: '',
    expect: ''
  },
  {
    send: 'message',
    expect: `'${message}'`
  },
  {
    send: 'invoke_me(987)',
    expect: '\'invoked 987\''
  },
  {
    send: 'a = 12345',
    expect: '12345'
  },
  {
    send: '{a:1}',
    expect: '{ a: 1 }'
  },
];
const strictModeTests = [
  {
    send: 'ref = 1',
  },
];
const errorTests = [
  {
    send: 'throw new Error(\'test error\');',
    expect: ['Uncaught Error: test error']
  },
  {
    send: "throw { foo: 'bar' };",
    expect: "Uncaught { foo: 'bar' }"
  },
  {
    send: 'function test_func() {',
    expect: '... '
  },
  {
    send: '.break',
    expect: ''
  },
  {
    send: 'eval("function test_func() {")',
  },
  {
    send: '`io.js',
    expect: '... '
  },
  {
    send: '.break',
    expect: ''
  },
  {
    send: '`io.js ${"1.0"',
    expect: '... '
  },
  {
    send: '+ ".2"}`',
    expect: '\'io.js 1.0.2\''
  },
  {
    send: '`io.js ${',
    expect: '... '
  },
  {
    send: '"1.0" + ".2"}`',
    expect: '\'io.js 1.0.2\''
  },
  {
    send: '("a"',
    expect: '... '
  },
  {
    send: '.charAt(0))',
    expect: '\'a\''
  },
  {
    send: '.1234',
    expect: '0.1234'
  },
  {
    send: '.1+.1',
    expect: '0.2'
  },
  {
    send: 'JSON.parse(\'{"valid": "json"}\');',
    expect: '{ valid: \'json\' }'
  },
  {
    send: 'JSON.parse(\'{invalid: \\\'json\\\'}\');',
  },
  {
    send: 'JSON.parse(\'066\');',
  },
  {
    send: 'JSON.parse(\'{\');',
  },
  {
  },
  {
    send: 'new RegExp("foo", "wrong modifier");',
  },
  {
    send: '(function() { "use strict"; return 0755; })()',
    expect: [
      kSource,
      kArrow,
      '',
    ]
  },
  {
    send: '(function(a, a, b) { "use strict"; return a + b + c; })()',
    expect: [
      kSource,
      kArrow,
      '',
    ]
  },
  {
    send: '(function() { "use strict"; with (this) {} })()',
    expect: [
      kSource,
      kArrow,
      '',
    ]
  },
  {
    send: '(function() { "use strict"; var x; delete x; })()',
    expect: [
      kSource,
      kArrow,
      '',
    ]
  },
  {
    send: '(function() { "use strict"; eval = 17; })()',
    expect: [
      kSource,
      kArrow,
      '',
    ]
  },
  {
    send: '(function() { "use strict"; if (true) function f() { } })()',
    expect: [
      kSource,
      kArrow,
      '',
      'Uncaught:',
    ]
  },
  {
    send: 'function blah() { return 1; }',
    expect: 'undefined'
  },
  {
    send: 'blah()',
    expect: '1'
  },
  {
    send: 'var I = [1,2,3,function() {}]; I.pop()',
    expect: '[Function (anonymous)]'
  },
  {
    send: '{ a: ',
    expect: '... '
  },
  {
    send: '1 }',
    expect: '{ a: 1 }'
  },
  {
    send: '{ "a": ',
    expect: '... '
  },
  {
    send: '1 }',
    expect: '{ a: 1 }'
  },
  {
    send: 'class Foo { #private = true ',
    expect: '... '
  },
  {
    send: 'num = 123456789n',
    expect: '... '
  },
  {
    send: 'static foo = "bar" }',
    expect: 'undefined'
  },
  {
    send: '(function() {',
    expect: '... '
  },
  {
    expect: '... '
  },
  {
    send: 'return 1n;',
    expect: '... '
  },
  {
    send: '})()',
    expect: '1n'
  },
  {
    send: 'function f(){}; f(f(1,',
    expect: '... '
  },
  {
    send: '2)',
    expect: '... '
  },
  {
    send: ')',
    expect: 'undefined'
  },
  {
    send: 'npm install foobar',
    expect: [
      'npm should be run outside of the Node.js REPL, in your normal shell.',
      '(Press Ctrl+D to exit.)',
    ]
  },
  {
    send: '(function() {\n\nreturn 1;\n})()',
    expect: '... ... ... 1'
  },
  {
    send: '{\n\na: 1\n}',
    expect: '... ... ... { a: 1 }'
  },
  {
  },
  {
    send: 'var path = 42; path',
    expect: '42'
  },
  {
    send: '.invalid_repl_command',
    expect: 'Invalid REPL keyword'
  },
  {
    send: '.toString',
    expect: 'Invalid REPL keyword'
  },
  {
    send: '[] \\',
    expect: [
      kSource,
      kArrow,
      '',
    ]
  },
  {
    send: '\'the\\\nfourth\\\neye\'',
    expect: ['... ... \'thefourtheye\'']
  },
  {
    send: '  \t    .break  \t  ',
    expect: ''
  },
  {
    send: '\'the \\\n   fourth\t\t\\\n  eye  \'',
    expect: '... ... \'the    fourth\\t\\t  eye  \''
  },
  {
    send: '\'the \\\n   fourth\' +  \'\t\t\\\n  eye  \'',
    expect: '... ... \'the    fourth\\t\\t  eye  \''
  },
  {
    send: '\'\\\n.break',
    expect: '... ' + prompt_unix
  },
  {
    send: '\'thefourth\\\n.help\neye\'',
    expect: [
      '',
      'Press Ctrl+C to abort current expression, Ctrl+D to exit the REPL',
    ]
  },
  {
    expect: '1'
  },
  {
    expect: [
      kSource,
      kArrow,
      '',
    ]
  },
  {
    expect: 'true'
  },
  {
    expect: 'false'
  },
  {
    send: '\n\r\n\r\n',
    expect: ''
  },
  {
    send: '\'the\\\n\\\nfourtheye\'\n',
    expect: '... ... \'thefourtheye\''
  },
  {
    expect: 'true'
  },
  {
    send: 'RegExp.$1\nRegExp.$2\nRegExp.$3\nRegExp.$4\nRegExp.$5\n' +
          'RegExp.$6\nRegExp.$7\nRegExp.$8\nRegExp.$9\n',
    expect: ['\'1\'', '\'2\'', '\'3\'', '\'4\'', '\'5\'', '\'6\'',
             '\'7\'', '\'8\'', '\'9\'']
  },
  {
    send: 'function x() {\nreturn \'\\n\';\n }',
    expect: '... ... undefined'
  },
  {
    send: 'function x() {\nreturn \'\\\\\';\n }',
    expect: '... ... undefined'
  },
  {
    expect: '... ... undefined'
  },
  {
    expect: '... ... undefined'
  },
  {
    expect: '... undefined'
  },
  {
    expect: '... undefined'
  },
  {
    send: 'function x() {\nvar i = "\'";\n }',
    expect: '... ... undefined'
  },
  {
    expect: 'undefined'
  },
  {
    expect: 'undefined'
  },
  {
    expect: 'undefined'
  },
  {
  },
  {
  },
  {
    expect: 'undefined'
  },
  {
    expect: '... ... ... undefined'
  },
  {
    expect: [
      "  code: 'MODULE_NOT_FOUND',",
      "  requireStack: [ '<repl>' ]",
      '}',
    ]
  },
  {
    expect: '... ... undefined'
  },
  {
    expect: '... ... undefined'
  },
  {
    expect: '... ... undefined'
  },
  {
    expect: '... ... undefined'
  },
  {
    send: '{ var x = 4; }',
    expect: 'undefined'
  },
  {
    send: 'a = 3.5e',
    expect: [
      kSource,
      kArrow,
      '',
    ]
  },
  {
    send: 'function name(){ return "node"; };name()',
    expect: '\'node\''
  },
  {
    send: 'function name(){ return "nodejs"; };name()',
    expect: '\'nodejs\''
  },
  {
    send: 'a = 3.5e',
    expect: [
      kSource,
      kArrow,
      '',
    ]
  },
  {
    send: 'a = 3.5e',
    expect: [
      kSource,
      kArrow,
      '',
    ]
  },
  {
    send: 'function* foo() {}; foo().next();',
    expect: '{ value: undefined, done: true }'
  },
  {
    send: 'function *foo() {}; foo().next();',
    expect: '{ value: undefined, done: true }'
  },
  {
    send: 'function*foo() {}; foo().next();',
    expect: '{ value: undefined, done: true }'
  },
  {
    send: 'function * foo() {}; foo().next()',
    expect: '{ value: undefined, done: true }'
  },
  {
    expect: '... ... undefined'
  },
  {
    expect: '... ... NaN'
  },
  {
    expect: '... ... undefined'
  },
  {
    send: 'new Proxy({x:42}, {get(){throw null}});',
    expect: 'Proxy [ { x: 42 }, { get: [Function: get] } ]'
  },
  {
    send: 'repl.writer.options.showProxy = false, new Proxy({x:42}, {});',
    expect: '{ x: 42 }'
  },
  {
    send: '`foo \n`',
    expect: '... \'foo \\n\''
  },
  {
    send: ' \t  \n',
    expect: 'undefined'
  },
  {
    send: '...[]',
    expect: [
      kSource,
      kArrow,
      '',
    ]
  },
  {
    send: '.break',
    expect: ''
  },
  {
    send: 'console.log("Missing comma in arg list" process.version)',
    expect: [
      kSource,
      kArrow,
      '',
    ]
  },
  {
    send: 'x = {\nfield\n{',
    expect: [
      '... ... {',
      kArrow,
      '',
    ]
  },
  {
    send: '(2 + 3))',
    expect: [
      kSource,
      kArrow,
      '',
    ]
  },
  {
    send: 'if (typeof process === "object"); {',
    expect: '... '
  },
  {
    send: 'console.log("process is defined");',
    expect: '... '
  },
  {
    send: '} else {',
    expect: [
      kSource,
      kArrow,
      '',
    ]
  },
  {
    send: 'console',
    expect: [
      'Object [console] {',
      '  log: [Function: log],',
      '  warn: [Function: warn],',
      '  dir: [Function: dir],',
      '  time: [Function: time],',
      '  timeEnd: [Function: timeEnd],',
      '  timeLog: [Function: timeLog],',
      '  trace: [Function: trace],',
      '  assert: [Function: assert],',
      '  clear: [Function: clear],',
      '  count: [Function: count],',
      '  countReset: [Function: countReset],',
      '  group: [Function: group],',
      '  groupEnd: [Function: groupEnd],',
      '  table: [Function: table],',
      ...process.features.inspector ? [
        '  profile: [Function: profile],',
        '  profileEnd: [Function: profileEnd],',
        '  timeStamp: [Function: timeStamp],',
        '  context: [Function: context]',
      ] : [],
      '}',
    ]
  },
];
const tcpTests = [
  {
    send: '',
    expect: ''
  },
  {
    send: 'invoke_me(333)',
    expect: '\'invoked 333\''
  },
  {
    send: 'a += 1',
    expect: '12346'
  },
  {
    send: `require(${JSON.stringify(moduleFilename)}).number`,
    expect: '42'
  },
  {
    send: 'import comeOn from \'fhqwhgads\'',
    expect: [
      kSource,
      kArrow,
      '',
      'Uncaught:',
    ]
  },
];
(async function() {
  {
    const [ socket, replServer ] = await startUnixRepl();
    await runReplTests(socket, prompt_unix, unixTests);
    await runReplTests(socket, prompt_unix, errorTests);
    replServer.replMode = repl.REPL_MODE_STRICT;
    await runReplTests(socket, prompt_unix, strictModeTests);
    socket.end();
  }
  {
    const [ socket ] = await startTCPRepl();
    await runReplTests(socket, prompt_tcp, tcpTests);
    socket.end();
  }
  common.allowGlobals(...Object.values(global));
})().then(common.mustCall());
function startTCPRepl() {
  let resolveSocket, resolveReplServer;
  const server = net.createServer(common.mustCall((socket) => {
    assert.strictEqual(server, socket.server);
    socket.on('end', common.mustCall(() => {
      socket.end();
    }));
    resolveReplServer(repl.start(prompt_tcp, socket));
  }));
  server.listen(0, common.mustCall(() => {
    const client = net.createConnection(server.address().port);
    client.setEncoding('utf8');
    client.on('connect', common.mustCall(() => {
      assert.strictEqual(client.readable, true);
      assert.strictEqual(client.writable, true);
      resolveSocket(client);
    }));
    client.on('close', common.mustCall(() => {
      server.close();
    }));
  }));
  return Promise.all([
    new Promise((resolve) => resolveSocket = resolve),
    new Promise((resolve) => resolveReplServer = resolve),
  ]);
}
function startUnixRepl() {
  let resolveSocket, resolveReplServer;
  const server = net.createServer(common.mustCall((socket) => {
    assert.strictEqual(server, socket.server);
    socket.on('end', common.mustCall(() => {
      socket.end();
    }));
    const replServer = repl.start({
      prompt: prompt_unix,
      input: socket,
      output: socket,
      useGlobal: true
    });
    replServer.context.message = message;
    resolveReplServer(replServer);
  }));
  tmpdir.refresh();
  server.listen(common.PIPE, common.mustCall(() => {
    const client = net.createConnection(common.PIPE);
    client.setEncoding('utf8');
    client.on('connect', common.mustCall(() => {
      assert.strictEqual(client.readable, true);
      assert.strictEqual(client.writable, true);
      resolveSocket(client);
    }));
    client.on('close', common.mustCall(() => {
      server.close();
    }));
  }));
  return Promise.all([
    new Promise((resolve) => resolveSocket = resolve),
    new Promise((resolve) => resolveReplServer = resolve),
  ]);
}
function event(ee, expected) {
  return new Promise((resolve, reject) => {
    const timeout = setTimeout(() => {
      const data = inspect(expected, { compact: false });
      const msg = `The REPL did not reply as expected for:\n\n${data}`;
      reject(new Error(msg));
    }, common.platformTimeout(9999));
    ee.once('data', common.mustCall((...args) => {
      clearTimeout(timeout);
      resolve(...args);
    }));
  });
}
