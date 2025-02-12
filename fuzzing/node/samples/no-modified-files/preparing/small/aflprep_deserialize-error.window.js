const { HTTPS_NOTSAMESITE_ORIGIN } = get_host_info();
const iframe = document.createElement('iframe');
window.addEventListener('message', async evt => {
  switch (evt.data) {
    case 'init done': {
      const ws = new WritableStream();
      iframe.contentWindow.postMessage(ws, '*', [ws]);
      return;
    }
    case 'ws done': {
      const module = await createWasmModule();
      const rs = new ReadableStream({
        start(controller) {
          controller.enqueue(module);
        }
      });
      iframe.contentWindow.postMessage(rs, '*', [rs]);
      return;
    }
    case 'rs done': {
      iframe.remove();
    }
  }
});
document.body.appendChild(iframe);
fetch_tests_from_window(iframe.contentWindow);
