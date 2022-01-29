'use strict';
const promise = testMessageEvent(self);
promise
    .then(() => postMessage('OK'))
    .catch(err => postMessage(`BAD: ${err}`));
