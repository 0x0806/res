'use strict';
const assert = require('assert');
{
  const queue = new PriorityQueue();
  for (let i = 15; i > 0; i--)
    queue.insert(i);
  for (let i = 1; i < 16; i++) {
    assert.strictEqual(queue.peek(), i);
    assert.strictEqual(queue.shift(), i);
  }
  assert.strictEqual(queue.shift(), undefined);
  for (let i = 1; i < 16; i++)
    queue.insert(i);
  for (let i = 1; i < 16; i++) {
    assert.strictEqual(queue.shift(), i);
  }
  assert.strictEqual(queue.shift(), undefined);
}
{
  const queue = new PriorityQueue();
  for (let i = 2048; i > 0; i--)
    queue.insert(i);
  for (let i = 1; i < 2049; i++) {
    assert.strictEqual(queue.shift(), i);
  }
  assert.strictEqual(queue.shift(), undefined);
}
{
  const queue = new PriorityQueue((a, b) => b - a);
  for (let i = 1; i < 17; i++)
    queue.insert(i);
  for (let i = 16; i > 0; i--) {
    assert.strictEqual(queue.shift(), i);
  }
  assert.strictEqual(queue.shift(), undefined);
}
{
  const queue = new PriorityQueue((a, b) => {
    return a.value - b.value;
  }, (node, pos) => (node.position = pos));
  for (let i = 1; i < 17; i++)
    queue.insert({ value: i, position: null });
  for (let i = 1; i < 17; i++) {
    assert.strictEqual(queue.peek().value, i);
    queue.removeAt(queue.peek().position);
  }
  assert.strictEqual(queue.peek(), undefined);
}
{
  const queue = new PriorityQueue((a, b) => {
    return a.value - b.value;
  }, (node, pos) => (node.position = pos));
  queue.insert({ value: 1, position: null });
  queue.insert({ value: 2, position: null });
  queue.insert({ value: 3, position: null });
  queue.insert({ value: 4, position: null });
  queue.insert({ value: 5, position: null });
  queue.insert({ value: 2, position: null });
  const secondLargest = { value: 10, position: null };
  queue.insert(secondLargest);
  const largest = { value: 15, position: null };
  queue.insert(largest);
  queue.removeAt(5);
  assert.strictEqual(largest.position, 5);
  queue.removeAt(6);
  assert.strictEqual(secondLargest.position, 6);
  queue.removeAt(6);
  assert.strictEqual(queue.shift().value, 1);
  assert.strictEqual(queue.shift().value, 2);
  assert.strictEqual(queue.shift().value, 2);
  assert.strictEqual(queue.shift().value, 4);
  assert.strictEqual(queue.shift().value, 15);
  assert.strictEqual(queue.shift(), undefined);
}
{
  const queue = new PriorityQueue((a, b) => {
    return a.value - b.value;
  }, (node, pos) => (node.position = pos));
  const i3 = { value: 3, position: null };
  const i7 = { value: 7, position: null };
  const i8 = { value: 8, position: null };
  queue.insert({ value: 1, position: null });
  queue.insert({ value: 6, position: null });
  queue.insert({ value: 2, position: null });
  queue.insert(i7);
  queue.insert(i8);
  queue.insert(i3);
  assert.strictEqual(i7.position, 4);
  queue.removeAt(4);
  assert.strictEqual(i3.position, 2);
  queue.removeAt(2);
  assert.strictEqual(i8.position, 4);
}
