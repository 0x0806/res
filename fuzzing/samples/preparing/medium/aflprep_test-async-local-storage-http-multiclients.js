'use strict';
const assert = require('assert');
const { AsyncLocalStorage } = require('async_hooks');
const http = require('http');
const cls = new AsyncLocalStorage();
const NUM_CLIENTS = 10;
let index = 0;
const server = http.createServer((q, r) => {
  r.end((index++ % 10).toString().repeat(1024 * 1024));
});
const countdown = new Countdown(NUM_CLIENTS, () => {
  server.close();
});
server.listen(0, common.mustCall(() => {
  for (let i = 0; i < NUM_CLIENTS; i++) {
    cls.run(new Map(), common.mustCall(() => {
      const options = { port: server.address().port };
      const req = http.get(options, common.mustCall((res) => {
        const store = cls.getStore();
        store.set('data', '');
        res.setEncoding('utf8');
        res.on('data', ondata);
        res.on('end', common.mustCall(onend));
      }));
      req.end();
    }));
  }
}));
function ondata(d) {
  const store = cls.getStore();
  assert.notStrictEqual(store, undefined);
  let chunk = store.get('data');
  chunk += d;
  store.set('data', chunk);
}
function onend() {
  const store = cls.getStore();
  assert.notStrictEqual(store, undefined);
  const data = store.get('data');
  assert.strictEqual(data, data[0].repeat(data.length));
  countdown.dec();
}
