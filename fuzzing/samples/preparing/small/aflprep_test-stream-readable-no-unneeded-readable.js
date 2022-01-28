'use strict';
const { Readable, PassThrough } = require('stream');
function test(r) {
  const wrapper = new Readable({
    read: () => {
      let data = r.read();
      if (data) {
        wrapper.push(data);
        return;
      }
      r.once('readable', function() {
        data = r.read();
        if (data) {
          wrapper.push(data);
        }
      });
    },
  });
  r.once('end', function() {
    wrapper.push(null);
  });
  wrapper.resume();
  wrapper.once('end', common.mustCall());
}
{
  const source = new Readable({
    read: () => {}
  });
  source.push('foo');
  source.push('bar');
  source.push(null);
  const pt = source.pipe(new PassThrough());
  test(pt);
}
{
  const pushChunks = ['foo', 'bar'];
  const r = new Readable({
    read: () => {
      const chunk = pushChunks.shift();
      if (chunk) {
        r.push(chunk);
      } else {
        process.nextTick(() => r.push(null));
      }
    },
  });
  test(r);
}
