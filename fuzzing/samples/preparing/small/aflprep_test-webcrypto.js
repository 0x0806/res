'use strict';
if (!common.hasCrypto)
  common.skip('missing crypto');
const runner = new WPTRunner('WebCryptoAPI');
runner.setFlags(['--expose-internals']);
runner.setInitScript(`
  const {
    Crypto,
    SubtleCrypto,
    crypto,
  const { DOMException } = internalBinding('messaging');
  global.DOMException = DOMException;
  Object.defineProperties(global, {
    Crypto: {
      value: Crypto,
      configurable: true,
      writable: true,
      enumerable: false,
    },
    SubtleCrypto: {
      value: SubtleCrypto,
      configurable: true,
      writable: true,
      enumerable: false,
    },
    CryptoKey: {
      value: crypto.CryptoKey,
      configurable: true,
      writable: true,
      enumerable: false,
    },
    crypto: {
      value: crypto,
      configurable: true,
      writable: true,
      enumerable: false,
    },
  });
`);
runner.runJsTests();
