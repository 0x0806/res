'use strict';
setup({explicit_done: true});
function createRealm() {
  let iframe = document.createElement('iframe');
  iframe.srcdoc = `<!doctype html>
<script>
onmessage = event => {
  if (event.source !== window.parent) {
    throw new Error('unexpected message with source ' + event.source);
  }
  eval(event.data);
};
${scriptEndTag}`;
  iframe.style.display = 'none';
  document.body.appendChild(iframe);
  let realmPromiseResolve;
  const realmPromise = new Promise(resolve => {
    realmPromiseResolve = resolve;
  });
  iframe.onload = () => {
    realmPromiseResolve(iframe.contentWindow);
  };
  return realmPromise;
}
async function createRealms() {
  window.constructorRealm = await createRealm();
  window.constructedRealm = await createRealm();
  window.readRealm = await createRealm();
  window.writeRealm = await createRealm();
  window.methodRealm = await createRealm();
  await evalInRealmAndWait(methodRealm, `
  window.ReadableStreamDefaultReader =
      new ReadableStream().getReader().constructor;
  window.WritableStreamDefaultWriter =
      new WritableStream().getWriter().constructor;
`);
  window.readMethod = methodRealm.ReadableStreamDefaultReader.prototype.read;
  window.writeMethod = methodRealm.WritableStreamDefaultWriter.prototype.write;
}
const id = (() => {
  let nextId = 0;
  return () => {
    return `realmsId${nextId++}`;
  };
})();
function evalInRealm(realm, code) {
  realm.postMessage(code, window.origin);
}
async function evalInRealmAndWait(realm, code) {
  const resolve = id();
  const waitOn = new Promise(r => {
    realm[resolve] = r;
  });
  evalInRealm(realm, code);
  evalInRealm(realm, `${resolve}();`);
  await waitOn;
}
async function evalInRealmAndReturn(realm, code) {
  const myId = id();
  await evalInRealmAndWait(realm, `window.${myId} = ${code};`);
  return realm[myId];
}
async function constructAndStore(what) {
  const objId = id();
  writeRealm[objId] = await evalInRealmAndReturn(
      constructedRealm, `new parent.constructorRealm.${what}`);
  readRealm[objId] = writeRealm[objId];
  return objId;
}
function readInReadRealm(objId) {
  return evalInRealmAndReturn(readRealm, `
parent.readMethod.call(window.${objId}.readable.getReader())`);
}
function writeInWriteRealm(objId, value) {
  const valueId = id();
  writeRealm[valueId] = value;
  return evalInRealmAndReturn(writeRealm, `
parent.writeMethod.call(window.${objId}.writable.getWriter(),
                        window.${valueId})`);
}
window.onload = () => {
  createRealms().then(() => {
    runGenericTests('TextEncoderStream');
    runTextEncoderStreamTests();
    runGenericTests('TextDecoderStream');
    runTextDecoderStreamTests();
    done();
  });
};
function runGenericTests(classname) {
  promise_test(async () => {
    const obj = await evalInRealmAndReturn(
        constructedRealm, `new parent.constructorRealm.${classname}()`);
    assert_equals(obj.constructor, constructorRealm[classname],
                  'obj should be in constructor realm');
  }, `a ${classname} object should be associated with the realm the ` +
     'constructor came from');
  promise_test(async () => {
    const objId = await constructAndStore(classname);
    const readableGetterId = id();
    readRealm[readableGetterId] = Object.getOwnPropertyDescriptor(
        methodRealm[classname].prototype, 'readable').get;
    const writableGetterId = id();
    writeRealm[writableGetterId] = Object.getOwnPropertyDescriptor(
        methodRealm[classname].prototype, 'writable').get;
    const readable = await evalInRealmAndReturn(
        readRealm, `${readableGetterId}.call(${objId})`);
    const writable = await evalInRealmAndReturn(
        writeRealm, `${writableGetterId}.call(${objId})`);
    assert_equals(readable.constructor, constructorRealm.ReadableStream,
                  'readable should be in constructor realm');
    assert_equals(writable.constructor, constructorRealm.WritableStream,
                  'writable should be in constructor realm');
  }, `${classname}'s readable and writable attributes should come from the ` +
     'same realm as the constructor definition');
}
function runTextEncoderStreamTests() {
  promise_test(async () => {
    const objId = await constructAndStore('TextEncoderStream');
    const writePromise = writeInWriteRealm(objId, 'A');
    const result = await readInReadRealm(objId);
    await writePromise;
    assert_equals(result.constructor, constructorRealm.Object,
                  'result should be in constructor realm');
    assert_equals(result.value.constructor, constructorRealm.Uint8Array,
                  'chunk should be in constructor realm');
  }, 'the output chunks when read is called after write should come from the ' +
     'same realm as the constructor of TextEncoderStream');
  promise_test(async () => {
    const objId = await constructAndStore('TextEncoderStream');
    const chunkPromise = readInReadRealm(objId);
    writeInWriteRealm(objId, 'A');
    const result = await chunkPromise;
    assert_equals(result.constructor, constructorRealm.Object,
                  'result should be in constructor realm');
    assert_equals(result.value.constructor, constructorRealm.Uint8Array,
                  'chunk should be in constructor realm');
  }, 'the output chunks when write is called with a pending read should come ' +
     'from the same realm as the constructor of TextEncoderStream');
  promise_test(async t => {
    const objId = await constructAndStore('TextEncoderStream');
    const readPromise = readInReadRealm(objId);
    await promise_rejects_js(t, constructorRealm.TypeError,
                             writeInWriteRealm(objId, {
                               toString() { return {}; }
                             }),
                             'write TypeError should come from constructor realm');
    return promise_rejects_js(t, constructorRealm.TypeError, readPromise,
                              'read TypeError should come from constructor realm');
  }, 'TypeError for unconvertable chunk should come from constructor realm ' +
     'of TextEncoderStream');
}
function runTextDecoderStreamTests() {
  promise_test(async () => {
    const objId = await constructAndStore('TextDecoderStream');
    const writePromise = writeInWriteRealm(objId, new Uint8Array([65]));
    const result = await readInReadRealm(objId);
    await writePromise;
    assert_equals(result.constructor, constructorRealm.Object,
                  'result should be in constructor realm');
  }, 'the result object when read is called after write should come from the ' +
     'same realm as the constructor of TextDecoderStream');
  promise_test(async () => {
    const objId = await constructAndStore('TextDecoderStream');
    const chunkPromise = readInReadRealm(objId);
    writeInWriteRealm(objId, new Uint8Array([65]));
    const result = await chunkPromise;
    assert_equals(result.constructor, constructorRealm.Object,
                  'result should be in constructor realm');
  }, 'the result object when write is called with a pending ' +
     'read should come from the same realm as the constructor of TextDecoderStream');
  promise_test(async t => {
    const objId = await constructAndStore('TextDecoderStream');
    const readPromise = readInReadRealm(objId);
    await promise_rejects_js(
      t, constructorRealm.TypeError,
      writeInWriteRealm(objId, {}),
      'write TypeError should come from constructor realm'
    );
    return promise_rejects_js(
      t, constructorRealm.TypeError, readPromise,
      'read TypeError should come from constructor realm'
    );
  }, 'TypeError for chunk with the wrong type should come from constructor ' +
     'realm of TextDecoderStream');
  promise_test(async t => {
    const objId =
          await constructAndStore(`TextDecoderStream('utf-8', {fatal: true})`);
    const readPromise = readInReadRealm(objId);
    await promise_rejects_js(
      t, constructorRealm.TypeError,
      writeInWriteRealm(objId, new Uint8Array([0xff])),
      'write TypeError should come from constructor realm'
    );
    return promise_rejects_js(
      t, constructorRealm.TypeError, readPromise,
      'read TypeError should come from constructor realm'
    );
  }, 'TypeError for invalid chunk should come from constructor realm ' +
     'of TextDecoderStream');
  promise_test(async t => {
    const objId =
          await constructAndStore(`TextDecoderStream('utf-8', {fatal: true})`);
    readInReadRealm(objId);
    const incompleteBytesId = id();
    writeRealm[incompleteBytesId] = new Uint8Array([0xf0]);
    return promise_rejects_js(
      t, constructorRealm.TypeError,
      evalInRealmAndReturn(writeRealm, `
(() => {
  const writer = window.${objId}.writable.getWriter();
  parent.writeMethod.call(writer, window.${incompleteBytesId});
  return parent.methodRealm.WritableStreamDefaultWriter.prototype
    .close.call(writer);
})();
`),
      'close TypeError should come from constructor realm'
    );
  }, 'TypeError for incomplete input should come from constructor realm ' +
     'of TextDecoderStream');
}
