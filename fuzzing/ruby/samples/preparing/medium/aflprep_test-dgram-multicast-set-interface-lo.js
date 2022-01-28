'use strict';
const assert = require('assert');
const dgram = require('dgram');
const util = require('util');
if (common.inFreeBSDJail) {
  common.skip('in a FreeBSD jail');
  return;
}
if (common.isSunOS) {
  common.skip('SunOs is not correctly delivering to loopback multicast.');
  return;
}
const networkInterfaces = require('os').networkInterfaces();
const fork = require('child_process').fork;
const MULTICASTS = {
  IPv4: ['224.0.0.115', '224.0.0.116', '224.0.0.117'],
  IPv6: ['ff02::1:115', 'ff02::1:116', 'ff02::1:117']
};
const LOOPBACK = { IPv4: '127.0.0.1', IPv6: '::1' };
const ANY = { IPv4: '0.0.0.0', IPv6: '::' };
const FAM = 'IPv4';
const PORTS = {};
for (let i = 0; i < MULTICASTS[FAM].length; i++) {
  PORTS[MULTICASTS[FAM][i]] = common.PORT + (common.isWindows ? i : 0);
}
const UDP = { IPv4: 'udp4', IPv6: 'udp6' };
const TIMEOUT = common.platformTimeout(5000);
const NOW = Date.now();
const TMPL = (tail) => `${NOW} - ${tail}`;
const interfaceAddress = ((networkInterfaces) => {
  for (const name in networkInterfaces) {
    for (const localInterface of networkInterfaces[name]) {
      if (!localInterface.internal && localInterface.family === FAM) {
        let interfaceAddress = localInterface.address;
        if (FAM === 'IPv6')
          interfaceAddress += `${interfaceAddress}%${name}`;
        return interfaceAddress;
      }
    }
  }
})(networkInterfaces);
assert.ok(interfaceAddress);
const messages = [
  { tail: 'First message to send', mcast: MULTICASTS[FAM][0], rcv: true },
  { tail: 'Second message to send', mcast: MULTICASTS[FAM][0], rcv: true },
  { tail: 'Third message to send', mcast: MULTICASTS[FAM][1], rcv: true,
    newAddr: interfaceAddress },
  { tail: 'Fourth message to send', mcast: MULTICASTS[FAM][2] },
  { tail: 'Fifth message to send', mcast: MULTICASTS[FAM][1], rcv: true },
  { tail: 'Sixth message to send', mcast: MULTICASTS[FAM][2], rcv: true,
    newAddr: LOOPBACK[FAM] },
];
if (process.argv[2] !== 'child') {
  const IFACES = [ANY[FAM], interfaceAddress, LOOPBACK[FAM]];
  const workers = {};
  const listeners = MULTICASTS[FAM].length * 2;
  let listening = 0;
  let dead = 0;
  let i = 0;
  let done = 0;
  let timer = null;
  const killSubprocesses = (subprocesses) => {
    for (const i in subprocesses)
      subprocesses[i].kill();
  };
  timer = setTimeout(() => {
    console.error('[PARENT] Responses were not received within %d ms.',
                  TIMEOUT);
    console.error('[PARENT] Skip');
    killSubprocesses(workers);
    common.skip('Check filter policy');
    process.exit(1);
  }, TIMEOUT);
  for (let i = 0; i < listeners; i++) {
    const IFACE = IFACES[i % IFACES.length];
    const MULTICAST = MULTICASTS[FAM][i % MULTICASTS[FAM].length];
    const messagesNeeded = messages.filter((m) => m.rcv &&
                                                  m.mcast === MULTICAST)
                                   .map((m) => TMPL(m.tail));
    const worker = fork(process.argv[1],
                        ['child',
                         IFACE,
                         MULTICAST,
                         messagesNeeded.length,
                         NOW]);
    workers[worker.pid] = worker;
    worker.messagesReceived = [];
    worker.messagesNeeded = messagesNeeded;
    worker.on('exit', (code) => {
      if (worker.isDone || code === 0) {
        return;
      }
      dead += 1;
      console.error('[PARENT] Worker %d died. %d dead of %d',
                    worker.pid,
                    dead,
                    listeners);
      if (dead === listeners) {
        console.error('[PARENT] All workers have died.');
        console.error('[PARENT] Fail');
        killSubprocesses(workers);
        process.exit(1);
      }
    });
    worker.on('message', (msg) => {
      if (msg.listening) {
        listening += 1;
        if (listening === listeners) {
          sendSocket.sendNext();
        }
      } else if (msg.message) {
        worker.messagesReceived.push(msg.message);
        if (worker.messagesReceived.length === worker.messagesNeeded.length) {
          done += 1;
          worker.isDone = true;
          console.error('[PARENT] %d received %d messages total.',
                        worker.pid,
                        worker.messagesReceived.length);
        }
        if (done === listeners) {
          console.error('[PARENT] All workers have received the ' +
                        'required number of ' +
                        'messages. Will now compare.');
          Object.keys(workers).forEach((pid) => {
            const worker = workers[pid];
            let count = 0;
            worker.messagesReceived.forEach((buf) => {
              for (let i = 0; i < worker.messagesNeeded.length; ++i) {
                if (buf.toString() === worker.messagesNeeded[i]) {
                  count++;
                  break;
                }
              }
            });
            console.error('[PARENT] %d received %d matching messages.',
                          worker.pid,
                          count);
            assert.strictEqual(count, worker.messagesNeeded.length,
                               'A worker received ' +
                               'an invalid multicast message');
          });
          clearTimeout(timer);
          console.error('[PARENT] Success');
          killSubprocesses(workers);
        }
      }
    });
  }
  const sendSocket = dgram.createSocket({
    type: UDP[FAM],
    reuseAddr: true
  });
  sendSocket.bind(common.PORT, ANY[FAM]);
  sendSocket.on('listening', () => {
    console.error(`outgoing iface ${interfaceAddress}`);
  });
  sendSocket.on('close', () => {
    console.error('[PARENT] sendSocket closed');
  });
  sendSocket.sendNext = () => {
    const msg = messages[i++];
    if (!msg) {
      sendSocket.close();
      return;
    }
    console.error(TMPL(NOW, msg.tail));
    const buf = Buffer.from(TMPL(msg.tail));
    if (msg.newAddr) {
      console.error(`changing outgoing multicast ${msg.newAddr}`);
      sendSocket.setMulticastInterface(msg.newAddr);
    }
    sendSocket.send(
      buf,
      0,
      buf.length,
      PORTS[msg.mcast],
      msg.mcast,
      (err) => {
        assert.ifError(err);
        console.error('[PARENT] sent %s to %s:%s',
                      util.inspect(buf.toString()),
                      msg.mcast, PORTS[msg.mcast]);
        process.nextTick(sendSocket.sendNext);
      }
    );
  };
}
if (process.argv[2] === 'child') {
  const IFACE = process.argv[3];
  const MULTICAST = process.argv[4];
  const NEEDEDMSGS = Number(process.argv[5]);
  const SESSION = Number(process.argv[6]);
  const receivedMessages = [];
  console.error(`pid ${process.pid} iface ${IFACE} MULTICAST ${MULTICAST}`);
  const listenSocket = dgram.createSocket({
    type: UDP[FAM],
    reuseAddr: true
  });
  listenSocket.on('message', (buf, rinfo) => {
    if (!buf.toString().startsWith(SESSION)) return;
    console.error('[CHILD] %s received %s from %j',
                  process.pid,
                  util.inspect(buf.toString()),
                  rinfo);
    receivedMessages.push(buf);
    let closecb;
    if (receivedMessages.length === NEEDEDMSGS) {
      listenSocket.close();
      closecb = () => process.exit();
    }
    process.send({ message: buf.toString() }, closecb);
  });
  listenSocket.on('listening', () => {
    listenSocket.addMembership(MULTICAST, IFACE);
    process.send({ listening: true });
  });
  if (common.isWindows)
    listenSocket.bind(PORTS[MULTICAST], ANY[FAM]);
  else
    listenSocket.bind(common.PORT, MULTICAST);
}
