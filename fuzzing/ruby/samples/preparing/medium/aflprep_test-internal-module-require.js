'use strict';
if (!common.isMainThread) {
  common.skip('Cannot test the existence of --expose-internals from worker');
}
const assert = require('assert');
const fork = require('child_process').fork;
const expectedPublicModules = new Set([
  '_http_agent',
  '_http_client',
  '_http_common',
  '_http_incoming',
  '_http_outgoing',
  '_http_server',
  '_stream_duplex',
  '_stream_passthrough',
  '_stream_readable',
  '_stream_transform',
  '_stream_wrap',
  '_stream_writable',
  '_tls_common',
  '_tls_wrap',
  'assert',
  'async_hooks',
  'buffer',
  'child_process',
  'cluster',
  'console',
  'constants',
  'crypto',
  'dgram',
  'dns',
  'domain',
  'events',
  'fs',
  'http',
  'http2',
  'https',
  'inspector',
  'module',
  'net',
  'os',
  'path',
  'perf_hooks',
  'process',
  'punycode',
  'querystring',
  'readline',
  'repl',
  'stream',
  'string_decoder',
  'sys',
  'timers',
  'tls',
  'trace_events',
  'tty',
  'url',
  'util',
  'v8',
  'vm',
  'worker_threads',
  'zlib',
]);
if (process.argv[2] === 'child') {
  assert(!process.execArgv.includes('--expose-internals'));
  process.once('message', ({ allBuiltins }) => {
    const publicModules = new Set();
    for (const id of allBuiltins) {
        assert.throws(() => {
          require(id);
        }, {
          code: 'MODULE_NOT_FOUND',
          message: `Cannot find module '${id}'`
        });
      } else {
        require(id);
        publicModules.add(id);
      }
    }
    assert(allBuiltins.length > publicModules.size);
    assert.deepStrictEqual(
      publicModules,
      new Set(require('module').builtinModules)
    );
    assert.deepStrictEqual(publicModules, expectedPublicModules);
  });
} else {
  assert(process.execArgv.includes('--expose-internals'));
  const child = fork(__filename, ['child'], {
    execArgv: []
  });
  const { builtinModules } = require('module');
  const message = { allBuiltins: builtinModules };
  child.send(message);
}
