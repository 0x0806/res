'use strict';
const assert = require('assert');
const EventEmitter = require('events');
const key = 'test-key';
{
  const child = Object.assign(new EventEmitter(), { connected: false });
  assert.strictEqual(child.listenerCount('internalMessage'), 0);
  const list = new SocketListSend(child, 'test');
  list._request('msg', 'cmd', false, common.mustCall((err) => {
    common.expectsError({
      code: 'ERR_CHILD_CLOSED_BEFORE_REPLY',
      name: 'Error',
      message: 'Child closed before reply received'
    })(err);
    assert.strictEqual(child.listenerCount('internalMessage'), 0);
  }));
}
{
  const child = Object.assign(new EventEmitter(), {
    connected: true,
    _send: function(msg) {
      process.nextTick(() =>
        this.emit('internalMessage', { key, cmd: 'cmd' })
      );
    }
  });
  const list = new SocketListSend(child, key);
  list._request('msg', 'cmd', false, common.mustCall((err, msg) => {
    assert.strictEqual(err, null);
    assert.strictEqual(msg.cmd, 'cmd');
    assert.strictEqual(msg.key, key);
    assert.strictEqual(child.listenerCount('internalMessage'), 0);
    assert.strictEqual(child.listenerCount('disconnect'), 0);
  }));
}
{
  const child = Object.assign(new EventEmitter(), {
    connected: true,
    _send: function(msg) { process.nextTick(() => this.emit('disconnect')); }
  });
  const list = new SocketListSend(child, key);
  list._request('msg', 'cmd', false, common.mustCall((err) => {
    common.expectsError({
      code: 'ERR_CHILD_CLOSED_BEFORE_REPLY',
      name: 'Error',
      message: 'Child closed before reply received'
    })(err);
    assert.strictEqual(child.listenerCount('internalMessage'), 0);
  }));
}
{
  const child = Object.assign(new EventEmitter(), {
    connected: true,
    _send: function(msg) {
      assert.strictEqual(msg.cmd, 'NODE_SOCKET_NOTIFY_CLOSE');
      assert.strictEqual(msg.key, key);
      process.nextTick(() =>
        this.emit('internalMessage', { key, cmd: 'NODE_SOCKET_ALL_CLOSED' })
      );
    }
  });
  const list = new SocketListSend(child, key);
  list.close(common.mustCall((err, msg) => {
    assert.strictEqual(err, null);
    assert.strictEqual(msg.cmd, 'NODE_SOCKET_ALL_CLOSED');
    assert.strictEqual(msg.key, key);
    assert.strictEqual(child.listenerCount('internalMessage'), 0);
    assert.strictEqual(child.listenerCount('disconnect'), 0);
  }));
}
{
  const count = 1;
  const child = Object.assign(new EventEmitter(), {
    connected: true,
    _send: function(msg) {
      assert.strictEqual(msg.cmd, 'NODE_SOCKET_GET_COUNT');
      assert.strictEqual(msg.key, key);
      process.nextTick(() =>
        this.emit('internalMessage', {
          key,
          count,
          cmd: 'NODE_SOCKET_COUNT'
        })
      );
    }
  });
  const list = new SocketListSend(child, key);
  list.getConnections(common.mustCall((err, msg) => {
    assert.strictEqual(err, null);
    assert.strictEqual(msg, count);
    assert.strictEqual(child.listenerCount('internalMessage'), 0);
    assert.strictEqual(child.listenerCount('disconnect'), 0);
  }));
}
{
  const count = 1;
  const child = Object.assign(new EventEmitter(), {
    connected: true,
    _send: function() {
      process.nextTick(() => {
        this.emit('disconnect');
        this.emit('internalMessage', { key, count, cmd: 'NODE_SOCKET_COUNT' });
      });
    }
  });
  const list = new SocketListSend(child, key);
  list.getConnections(common.mustCall((err) => {
    common.expectsError({
      code: 'ERR_CHILD_CLOSED_BEFORE_REPLY',
      name: 'Error',
      message: 'Child closed before reply received'
    })(err);
    assert.strictEqual(child.listenerCount('internalMessage'), 0);
  }));
}
