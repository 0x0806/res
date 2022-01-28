'use strict';
const assert = require('assert');
const vm = require('vm');
const { WASI } = require('wasi');
const bufferSource = fixtures.readSync('simple.wasm');
(async () => {
  {
    const wasi = new WASI();
    assert.throws(
      () => { wasi.start(); },
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
      () => { wasi.start(instance); },
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
        return { memory: new Uint8Array() };
      },
    });
    assert.throws(
      () => { wasi.start(instance); },
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
      () => { wasi.start(instance); },
      {
        code: 'ERR_INVALID_ARG_TYPE',
        message: 'The "instance.exports._initialize" property must be' +
          ' undefined. Received function _initialize',
      }
    );
  }
  {
    const wasi = new WASI({});
    const wasm = await WebAssembly.compile(bufferSource);
    const instance = await WebAssembly.instantiate(wasm);
    Object.defineProperty(instance, 'exports', {
      get() { return { _start() {} }; }
    });
    assert.throws(
      () => { wasi.start(instance); },
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
          memory: {},
        };
      }
    });
    assert.throws(
      () => { wasi.start(instance); },
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
          memory: { buffer: new ArrayBuffer(0) },
        };
      }
    });
    wasi.start(instance);
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
              _start() {},
              memory: new WebAssembly.Memory({ initial: 1 })
            };
          }
        });
        return instance;
      })()
    `, { bufferSource });
    wasi.start(instance);
  }
  {
    const wasi = new WASI({});
    const wasm = await WebAssembly.compile(bufferSource);
    const instance = await WebAssembly.instantiate(wasm);
    Object.defineProperty(instance, 'exports', {
      get() {
        return {
          _start() {},
          memory: new WebAssembly.Memory({ initial: 1 })
        };
      }
    });
    wasi.start(instance);
    assert.throws(
      () => { wasi.start(instance); },
      {
        code: 'ERR_WASI_ALREADY_STARTED',
      }
    );
  }
})().then(common.mustCall());
