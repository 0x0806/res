self.addEventListener('message', e => {
  URL.revokeObjectURL(e.data.url);
  URL.createObjectURL(new Blob([]));
  self.postMessage('revoked');
});
