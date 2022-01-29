'use strict';
runner.setFlags(['--expose-internals']);
runner.setInitScript(`
  const { atob, btoa } = require('buffer');
  const { DOMException } = internalBinding('messaging');
  global.DOMException = DOMException;
`);
runner.runJsTests();
