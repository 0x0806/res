'use strict';
const assert = require('assert');
const fs = require('fs');
const join = require('path').join;
const currentFileData = 'ABCD';
const s = '南越国是前203年至前111年存在于岭南地区的一个国家，国都位于番禺，疆域包括今天中国的广东、' +
          '广西两省区的大部份地区，福建省、湖南、贵州、云南的一小部份地区和越南的北部。' +
          '南越国是秦朝灭亡后，由南海郡尉赵佗于前203年起兵兼并桂林郡和象郡后建立。' +
          '前196年和前179年，南越国曾先后两次名义上臣属于西汉，成为西汉的“外臣”。前112年，' +
          '南越国末代君主赵建德与西汉发生战争，被汉武帝于前111年所灭。南越国共存在93年，' +
          '历经五代君主。南越国是岭南地区的第一个有记载的政权国家，采用封建制和郡县制并存的制度，' +
          '它的建立保证了秦末乱世岭南地区社会秩序的稳定，有效的改善了岭南地区落后的政治、##济现状。\n';
tmpdir.refresh();
const throwNextTick = (e) => { process.nextTick(() => { throw e; }); };
{
  const filename = join(tmpdir.path, 'append.txt');
  fs.appendFile(filename, s, common.mustSucceed(() => {
    fs.readFile(filename, common.mustSucceed((buffer) => {
      assert.strictEqual(Buffer.byteLength(s), buffer.length);
    }));
  }));
}
{
  const filename = join(tmpdir.path, 'append-promise.txt');
  fs.promises.appendFile(filename, s)
    .then(common.mustCall(() => fs.promises.readFile(filename)))
    .then((buffer) => {
      assert.strictEqual(Buffer.byteLength(s), buffer.length);
    })
    .catch(throwNextTick);
}
{
  const filename = join(tmpdir.path, 'append-non-empty.txt');
  fs.writeFileSync(filename, currentFileData);
  fs.appendFile(filename, s, common.mustSucceed(() => {
    fs.readFile(filename, common.mustSucceed((buffer) => {
      assert.strictEqual(Buffer.byteLength(s) + currentFileData.length,
                         buffer.length);
    }));
  }));
}
{
  const filename = join(tmpdir.path, 'append-non-empty-promise.txt');
  fs.writeFileSync(filename, currentFileData);
  fs.promises.appendFile(filename, s)
    .then(common.mustCall(() => fs.promises.readFile(filename)))
    .then((buffer) => {
      assert.strictEqual(Buffer.byteLength(s) + currentFileData.length,
                         buffer.length);
    })
    .catch(throwNextTick);
}
{
  const filename = join(tmpdir.path, 'append-buffer.txt');
  fs.writeFileSync(filename, currentFileData);
  const buf = Buffer.from(s, 'utf8');
  fs.appendFile(filename, buf, common.mustSucceed(() => {
    fs.readFile(filename, common.mustSucceed((buffer) => {
      assert.strictEqual(buf.length + currentFileData.length, buffer.length);
    }));
  }));
}
{
  const filename = join(tmpdir.path, 'append-buffer-promises.txt');
  fs.writeFileSync(filename, currentFileData);
  const buf = Buffer.from(s, 'utf8');
  fs.promises.appendFile(filename, buf)
    .then(common.mustCall(() => fs.promises.readFile(filename)))
    .then((buffer) => {
      assert.strictEqual(buf.length + currentFileData.length, buffer.length);
    })
    .catch(throwNextTick);
}
[false, 5, {}, null, undefined].forEach(async (data) => {
  const errObj = {
    code: 'ERR_INVALID_ARG_TYPE',
  };
  const filename = join(tmpdir.path, 'append-invalid-data.txt');
  assert.throws(
    () => fs.appendFile(filename, data, common.mustNotCall()),
    errObj
  );
  assert.throws(
    () => fs.appendFileSync(filename, data),
    errObj
  );
  await assert.rejects(
    fs.promises.appendFile(filename, data),
    errObj
  );
  assert.throws(
    () => fs.statSync(filename),
    {
      code: 'ENOENT',
    }
  );
});
{
  const filename = join(tmpdir.path, 'append-descriptors.txt');
  fs.writeFileSync(filename, currentFileData);
  fs.open(filename, 'a+', common.mustSucceed((fd) => {
    fs.appendFile(fd, s, common.mustSucceed(() => {
      fs.close(fd, common.mustSucceed(() => {
        fs.readFile(filename, common.mustSucceed((buffer) => {
          assert.strictEqual(Buffer.byteLength(s) + currentFileData.length,
                             buffer.length);
        }));
      }));
    }));
  }));
}
{
  const filename = join(tmpdir.path, 'append-descriptors-promises.txt');
  fs.writeFileSync(filename, currentFileData);
  let fd;
  fs.promises.open(filename, 'a+')
    .then(common.mustCall((fileDescriptor) => {
      fd = fileDescriptor;
      return fs.promises.appendFile(fd, s);
    }))
    .then(common.mustCall(() => fd.close()))
    .then(common.mustCall(() => fs.promises.readFile(filename)))
    .then(common.mustCall((buffer) => {
      assert.strictEqual(Buffer.byteLength(s) + currentFileData.length,
                         buffer.length);
    }))
    .catch(throwNextTick);
}
assert.throws(
  () => fs.appendFile(join(tmpdir.path, 'append6.txt'), console.log),
  { code: 'ERR_INVALID_CALLBACK' });
