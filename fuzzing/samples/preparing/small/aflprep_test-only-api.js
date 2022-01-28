'use strict';
const isChromiumBased = 'MojoInterfaceInterceptor' in self;
const isWebKitBased = !isChromiumBased && 'internals' in self;
 * Loads a script in a window or worker.
 *
 * @param {string} path - A script path
 * @returns {Promise}
function loadScript(path) {
  if (typeof document === 'undefined') {
    importScripts(path);
    return Promise.resolve();
  } else {
    const script = document.createElement('script');
    script.src = path;
    script.async = false;
    const p = new Promise((resolve, reject) => {
      script.onload = () => { resolve(); };
      script.onerror = e => { reject(`Error loading ${path}`); };
    })
    document.head.appendChild(script);
    return p;
  }
}
