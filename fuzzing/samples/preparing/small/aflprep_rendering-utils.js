"use strict";
 * Waits until we have at least one frame rendered, regardless of the engine.
 *
 * @returns {Promise}
function waitForAtLeastOneFrame() {
  return new Promise(resolve => {
    window.requestAnimationFrame(() => {
      window.requestAnimationFrame(() => {
        resolve();
      });
    });
  });
}
