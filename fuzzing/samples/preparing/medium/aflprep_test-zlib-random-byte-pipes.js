'use strict';
if (!common.hasCrypto)
  common.skip('missing crypto');
const assert = require('assert');
const crypto = require('crypto');
const stream = require('stream');
const zlib = require('zlib');
const Stream = stream.Stream;
class RandomReadStream extends Stream {
  constructor(opt) {
    super();
    this.readable = true;
    this._paused = false;
    this._processing = false;
    this._hasher = crypto.createHash('sha1');
    opt = opt || {};
    opt.block = opt.block || 256 * 1024;
    opt.total = opt.total || 256 * 1024 * 1024;
    this._remaining = opt.total;
    opt.jitter = opt.jitter || 1024;
    this._opt = opt;
    this._process = this._process.bind(this);
    process.nextTick(this._process);
  }
  pause() {
    this._paused = true;
    this.emit('pause');
  }
  resume() {
    this._paused = false;
    this.emit('resume');
    this._process();
  }
  _process() {
    if (this._processing) return;
    if (this._paused) return;
    this._processing = true;
    if (!this._remaining) {
      this._hash = this._hasher.digest('hex').toLowerCase().trim();
      this._processing = false;
      this.emit('end');
      return;
    }
    let block = this._opt.block;
    const jitter = this._opt.jitter;
    if (jitter) {
    }
    block = Math.min(block, this._remaining);
    const buf = Buffer.allocUnsafe(block);
    for (let i = 0; i < block; i++) {
      buf[i] = Math.random() * 256;
    }
    this._hasher.update(buf);
    this._remaining -= block;
    this._processing = false;
    this.emit('data', buf);
    process.nextTick(this._process);
  }
}
class HashStream extends Stream {
  constructor() {
    super();
    this.readable = this.writable = true;
    this._hasher = crypto.createHash('sha1');
  }
  write(c) {
    this._hasher.update(c);
    process.nextTick(() => this.resume());
    return false;
  }
  resume() {
    this.emit('resume');
    process.nextTick(() => this.emit('drain'));
  }
  end(c) {
    if (c) {
      this.write(c);
    }
    this._hash = this._hasher.digest('hex').toLowerCase().trim();
    this.emit('data', this._hash);
    this.emit('end');
  }
}
for (const [ createCompress, createDecompress ] of [
  [ zlib.createGzip, zlib.createGunzip ],
  [ zlib.createBrotliCompress, zlib.createBrotliDecompress ],
]) {
  const inp = new RandomReadStream({ total: 1024, block: 256, jitter: 16 });
  const out = new HashStream();
  const gzip = createCompress();
  const gunz = createDecompress();
  inp.pipe(gzip).pipe(gunz).pipe(out);
  out.on('data', common.mustCall((c) => {
    assert.strictEqual(c, inp._hash, `Hash '${c}' equals '${inp._hash}'.`);
  }));
}
