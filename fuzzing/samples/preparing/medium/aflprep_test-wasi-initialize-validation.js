'use strict';
const assert = require('assert');
const vm = require('vm');
const { WASI } = require('wasi');
const bufferSource = fixtures.readSync('simple.wasm');
(async () => {
  {
    const wasi = new WASI();
    assert.throws(
      () => { wasi.initialize(); },
      {
        code: 'ERR_INVALID_ARG_TYPE',
      }
    );
  }
  {
    const wasi = new WASI({});
    const wasm = await WebAssembly.compile(bufferSource);
    const instance = await WebAssembly.instantiate(wasm);
    Object.defineProperty(instance, 'exports', { get() { return null; } });
    assert.throws(
      () => { wasi.initialize(instance); },
      {
        code: 'ERR_INVALID_ARG_TYPE',
      }
    );
  }
  {
    const wasi = new WASI({});
    const wasm = await WebAssembly.compile(bufferSource);
    const instance = await WebAssembly.instantiate(wasm);
    Object.defineProperty(instance, 'exports', {
      get() {
        return { _initialize: 5, memory: new Uint8Array() };
      },
    });
    assert.throws(
      () => { wasi.initialize(instance); },
      {
        code: 'ERR_INVALID_ARG_TYPE',
      }
    );
  }
  {
    const wasi = new WASI({});
    const wasm = await WebAssembly.compile(bufferSource);
    const instance = await WebAssembly.instantiate(wasm);
    Object.defineProperty(instance, 'exports', {
      get() {
        return {
          _start() {},
          _initialize() {},
          memory: new Uint8Array(),
        };
      }
    });
    assert.throws(
      () => { wasi.initialize(instance); },
      {
        code: 'ERR_INVALID_ARG_TYPE',
        message: 'The "instance.exports._start" property must be' +
          ' undefined. Received function _start',
      }
    );
  }
  {
    const wasi = new WASI({});
    const wasm = await WebAssembly.compile(bufferSource);
    const instance = await WebAssembly.instantiate(wasm);
    Object.defineProperty(instance, 'exports', {
      get() { return { _initialize() {} }; }
    });
    assert.throws(
      () => { wasi.initialize(instance); },
      {
        code: 'ERR_INVALID_ARG_TYPE',
      }
    );
  }
  {
    const wasi = new WASI({});
    const wasm = await WebAssembly.compile(bufferSource);
    const instance = await WebAssembly.instantiate(wasm);
    Object.defineProperty(instance, 'exports', {
      get() {
        return {
          _initialize() {},
          memory: {},
        };
      }
    });
    assert.throws(
      () => { wasi.initialize(instance); },
      {
        code: 'ERR_INVALID_ARG_TYPE',
      }
    );
  }
  {
    const wasi = new WASI({});
    const wasm = await WebAssembly.compile(bufferSource);
    const instance = await WebAssembly.instantiate(wasm);
    Object.defineProperty(instance, 'exports', {
      get() {
        return {
          _initialize() {},
          memory: { buffer: new ArrayBuffer(0) },
        };
      }
    });
    wasi.initialize(instance);
  }
  {
    const wasi = new WASI({});
    const instance = await vm.runInNewContext(`
      (async () => {
        const wasm = await WebAssembly.compile(bufferSource);
        const instance = await WebAssembly.instantiate(wasm);
        Object.defineProperty(instance, 'exports', {
          get() {
            return {
              _initialize() {},
              memory: new WebAssembly.Memory({ initial: 1 })
            };
          }
        });
        return instance;
      })()
    `, { bufferSource });
    wasi.initialize(instance);
  }
  {
    const wasi = new WASI({});
    const wasm = await WebAssembly.compile(bufferSource);
    const instance = await WebAssembly.instantiate(wasm);
    Object.defineProperty(instance, 'exports', {
      get() {
        return {
          _initialize() {},
          memory: new WebAssembly.Memory({ initial: 1 })
        };
      }
    });
    wasi.initialize(instance);
    assert.throws(
      () => { wasi.initialize(instance); },
      {
        code: 'ERR_WASI_ALREADY_STARTED',
      }
    );
  }
})().then(common.mustCall());
