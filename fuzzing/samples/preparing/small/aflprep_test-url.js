'use strict';
const runner = new WPTRunner('url');
runner.setFlags(['--expose-internals']);
runner.setInitScript(`
  const { DOMException } = internalBinding('messaging');
  global.DOMException = DOMException;
`);
runner.setScriptModifier((obj) => {
  if (obj.filename.includes('toascii.window.js')) {
  }
});
runner.pretendGlobalThisAs('Window');
runner.runJsTests();
