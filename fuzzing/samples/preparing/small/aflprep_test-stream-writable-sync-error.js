'use strict';
const { Writable } = require('stream');
class MyStream extends Writable {
  #cb = undefined;
  constructor() {
    super({ autoDestroy: false });
  }
  _write(_, __, cb) {
    this.#cb = cb;
  }
  close() {
    this.#cb(new Error('foo'));
  }
}
const stream = new MyStream();
const mustError = common.mustCall(2);
stream.write('test', () => {});
stream.on('error', mustError);
stream.close();
stream.on('error', mustError);
