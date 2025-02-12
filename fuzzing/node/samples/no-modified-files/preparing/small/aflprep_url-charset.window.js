async_test(t => {
  const blob = new Blob(
      [
      ],
  const url = URL.createObjectURL(blob);
  const win = window.open(url);
  t.add_cleanup(() => {
    win.close();
  });
  win.onload = t.step_func_done(() => {
    assert_equals(win.document.charset, 'UTF-8');
  });
}, 'Blob charset should override any auto-detected charset.');
async_test(t => {
  const blob = new Blob(
      [`<!doctype html>\n<meta charset="ISO-8859-1">`],
  const url = URL.createObjectURL(blob);
  const win = window.open(url);
  t.add_cleanup(() => {
    win.close();
  });
  win.onload = t.step_func_done(() => {
    assert_equals(win.document.charset, 'UTF-8');
  });
}, 'Blob charset should override <meta charset>.');
