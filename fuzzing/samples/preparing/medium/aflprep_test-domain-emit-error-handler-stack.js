'use strict';
const assert = require('assert');
const domain = require('domain');
const EventEmitter = require('events');
const d1 = domain.create();
const d2 = domain.create();
const d3 = domain.create();
function checkExpectedDomains(err) {
  if (domain._stack.length !== err.expectedStackLength) {
    console.error('expected domains stack length of %d, but instead is %d',
                  err.expectedStackLength, domain._stack.length);
    process.exit(1);
  }
  if (process.domain !== err.expectedActiveDomain) {
    console.error('expected active domain to be %j, but instead is %j',
                  err.expectedActiveDomain, process.domain);
    process.exit(1);
  }
  process.nextTick(() => {
    const expectedStackLengthInNextTickCb =
            err.expectedStackLength > 0 ? 1 : 0;
    if (domain._stack.length !== expectedStackLengthInNextTickCb) {
      console.error('expected stack length in nextTick cb to be %d, ' +
                'but instead is %d', expectedStackLengthInNextTickCb,
                    domain._stack.length);
      process.exit(1);
    }
    const expectedActiveDomainInNextTickCb =
            expectedStackLengthInNextTickCb === 0 ? undefined :
              err.expectedActiveDomain;
    if (process.domain !== expectedActiveDomainInNextTickCb) {
      console.error('expected active domain in nextTick cb to be %j, ' +
                'but instead is %j', expectedActiveDomainInNextTickCb,
                    process.domain);
      process.exit(1);
    }
  });
}
d1.on('error', common.mustCall((err) => {
  checkExpectedDomains(err);
}, 2));
d2.on('error', common.mustCall((err) => {
  checkExpectedDomains(err);
}, 2));
d3.on('error', common.mustCall((err) => {
  checkExpectedDomains(err);
}, 1));
d1.run(() => {
  const ee = new EventEmitter();
  assert.strictEqual(process.domain, d1);
  assert.strictEqual(domain._stack.length, 1);
  const err = new Error('oops');
  err.expectedStackLength = 0;
  err.expectedActiveDomain = null;
  ee.emit('error', err);
  assert.strictEqual(process.domain, d1);
  assert.strictEqual(domain._stack.length, 1);
});
d1.run(() => {
  d1.run(() => {
    const ee = new EventEmitter();
    assert.strictEqual(process.domain, d1);
    assert.strictEqual(domain._stack.length, 2);
    const err = new Error('oops');
    err.expectedStackLength = 0;
    err.expectedActiveDomain = null;
    ee.emit('error', err);
    assert.strictEqual(process.domain, d1);
    assert.strictEqual(domain._stack.length, 2);
  });
});
d1.run(() => {
  d2.run(() => {
    const ee = new EventEmitter();
    assert.strictEqual(process.domain, d2);
    assert.strictEqual(domain._stack.length, 2);
    const err = new Error('oops');
    err.expectedStackLength = 1;
    err.expectedActiveDomain = d1;
    ee.emit('error', err);
    assert.strictEqual(process.domain, d2);
    assert.strictEqual(domain._stack.length, 2);
  });
});
d1.run(() => {
  d2.run(() => {
    d2.run(() => {
      const ee = new EventEmitter();
      assert.strictEqual(process.domain, d2);
      assert.strictEqual(domain._stack.length, 3);
      const err = new Error('oops');
      err.expectedStackLength = 1;
      err.expectedActiveDomain = d1;
      ee.emit('error', err);
      assert.strictEqual(process.domain, d2);
      assert.strictEqual(domain._stack.length, 3);
    });
  });
});
d3.run(() => {
  d1.run(() => {
    d3.run(() => {
      d3.run(() => {
        const ee = new EventEmitter();
        assert.strictEqual(process.domain, d3);
        assert.strictEqual(domain._stack.length, 4);
        const err = new Error('oops');
        err.expectedStackLength = 2;
        err.expectedActiveDomain = d1;
        ee.emit('error', err);
        assert.strictEqual(process.domain, d3);
        assert.strictEqual(domain._stack.length, 4);
      });
    });
  });
});
