async_test(t => {
  const run_result = 'test_script_OK';
  const blob_contents = 'window.test_result = "' + run_result + '";';
  const blob = new Blob([blob_contents]);
  const url = URL.createObjectURL(blob);
  const e = document.createElement('script');
  e.setAttribute('src', url);
  e.onload = t.step_func_done(() => {
    assert_equals(window.test_result, run_result);
  });
  document.body.appendChild(e);
}, 'Blob URLs can be used in <script> tags');
async_test(t => {
  const run_result = 'test_frame_OK';
  const blob_contents = '<!doctype html>\n<meta charset="utf-8">\n' +
  const url = URL.createObjectURL(blob);
  const frame = document.createElement('iframe');
  frame.setAttribute('src', url);
  frame.setAttribute('style', 'display:none;');
  document.body.appendChild(frame);
  frame.onload = t.step_func_done(() => {
    assert_equals(frame.contentWindow.test_result, run_result);
  });
}, 'Blob URLs can be used in iframes, and are treated same origin');
async_test(t => {
  const blob_contents = '<!doctype html>\n<meta charset="utf-8">\n' +
    '<body>\n' +
  const url = URL.createObjectURL(blob);
  const frame = document.createElement('iframe');
  frame.setAttribute('src', url + '#block2');
  document.body.appendChild(frame);
  frame.contentWindow.onscroll = t.step_func_done(() => {
    assert_equals(frame.contentWindow.scrollY, 5000);
  });
}, 'Blob URL fragment is implemented.');
